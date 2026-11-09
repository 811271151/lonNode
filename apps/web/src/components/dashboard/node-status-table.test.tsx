import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TRPCProvider, useTRPCClient } from "../../utils/trpc";
import { NodeStatusTable } from "./node-status-table";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const trpcClient = useTRPCClient();

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <TRPCProvider client={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    );
  };
}

describe("NodeStatusTable", () => {
  it("renders loading state initially", () => {
    render(<NodeStatusTable />, { wrapper: createWrapper() });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders empty state when no nodes exist", async () => {
    // Mock empty nodes response
    vi.mock("../../utils/trpc", () => ({
      useTRPC: () => ({
        nodes: {
          list: {
            useQuery: () => ({ data: [], isLoading: false }),
          },
        },
      }),
    }));

    render(<NodeStatusTable />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("No nodes found")).toBeInTheDocument();
      expect(screen.getByText("Add your first node to get started")).toBeInTheDocument();
    });
  });

  it("renders table with node data", async () => {
    const mockNodes = [
      {
        id: "1",
        name: "Temperature Node 001",
        type: "Temperature",
        status: "online" as const,
        lastSeenAt: new Date(Date.now() - 10000), // 10s ago
        nodeId: "node-001",
        location: "Room A",
        description: "Test node",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mock("../../utils/trpc", () => ({
      useTRPC: () => ({
        nodes: {
          list: {
            useQuery: () => ({ data: mockNodes, isLoading: false }),
          },
        },
      }),
    }));

    render(<NodeStatusTable />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Temperature Node 001")).toBeInTheDocument();
      expect(screen.getByText("Temperature")).toBeInTheDocument();
      expect(screen.getByText("Online")).toBeInTheDocument();
      expect(screen.getByText(/\d+s ago/)).toBeInTheDocument();
    });
  });

  it("displays relative time correctly", async () => {
    const mockNodes = [
      {
        id: "1",
        name: "Node 1",
        type: "Temperature",
        status: "online" as const,
        lastSeenAt: new Date(Date.now() - 120000), // 2m ago
        nodeId: "node-001",
        location: "Room A",
        description: "Test node",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mock("../../utils/trpc", () => ({
      useTRPC: () => ({
        nodes: {
          list: {
            useQuery: () => ({ data: mockNodes, isLoading: false }),
          },
        },
      }),
    }));

    render(<NodeStatusTable />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("2m ago")).toBeInTheDocument();
    });
  });

  it("displays 'Never' for null lastSeenAt", async () => {
    const mockNodes = [
      {
        id: "1",
        name: "Node 1",
        type: "Temperature",
        status: "offline" as const,
        lastSeenAt: null,
        nodeId: "node-001",
        location: "Room A",
        description: "Test node",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mock("../../utils/trpc", () => ({
      useTRPC: () => ({
        nodes: {
          list: {
            useQuery: () => ({ data: mockNodes, isLoading: false }),
          },
        },
      }),
    }));

    render(<NodeStatusTable />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Never")).toBeInTheDocument();
    });
  });

  it("calls onRowClick callback when row is clicked", async () => {
    const user = userEvent.setup();
    const mockOnRowClick = vi.fn();
    const mockNodes = [
      {
        id: "test-id-123",
        name: "Node 1",
        type: "Temperature",
        status: "online" as const,
        lastSeenAt: new Date(),
        nodeId: "node-001",
        location: "Room A",
        description: "Test node",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mock("../../utils/trpc", () => ({
      useTRPC: () => ({
        nodes: {
          list: {
            useQuery: () => ({ data: mockNodes, isLoading: false }),
          },
        },
      }),
    }));

    render(<NodeStatusTable onRowClick={mockOnRowClick} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Node 1")).toBeInTheDocument();
    });

    const row = screen.getByText("Node 1").closest("tr");
    if (row) {
      await user.click(row);
      expect(mockOnRowClick).toHaveBeenCalledWith("test-id-123");
    }
  });
});

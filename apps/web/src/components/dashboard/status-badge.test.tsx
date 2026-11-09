import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders online status with green color", () => {
    render(<StatusBadge status="online" />);
    const badge = screen.getByLabelText("Status: online");
    expect(badge).toHaveClass("bg-green-500");
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("renders offline status with gray color", () => {
    render(<StatusBadge status="offline" />);
    const badge = screen.getByLabelText("Status: offline");
    expect(badge).toHaveClass("bg-gray-400");
    expect(screen.getByText("Offline")).toBeInTheDocument();
  });

  it("renders warning status with yellow color", () => {
    render(<StatusBadge status="warning" />);
    const badge = screen.getByLabelText("Status: warning");
    expect(badge).toHaveClass("bg-yellow-500");
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatCard } from "./stat-card";

describe("StatCard", () => {
  it("renders the title correctly", () => {
    render(<StatCard title="Total Nodes" value={10} />);
    expect(screen.getByText("Total Nodes")).toBeInTheDocument();
  });

  it("renders the value correctly", () => {
    render(<StatCard title="Total Nodes" value={10} />);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders zero value correctly", () => {
    render(<StatCard title="Online" value={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders large numbers correctly", () => {
    render(<StatCard title="Total Nodes" value={9999} />);
    expect(screen.getByText("9999")).toBeInTheDocument();
  });
});

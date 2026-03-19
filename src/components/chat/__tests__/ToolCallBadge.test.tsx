import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";

describe("ToolCallBadge", () => {
  it("shows 'Creating /App.jsx' for str_replace_editor create", () => {
    render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/App.jsx" }} state="result" result={{}} />);
    expect(screen.getByText("Creating /App.jsx")).toBeTruthy();
  });

  it("shows 'Editing /Card.jsx' for str_replace_editor str_replace", () => {
    render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "str_replace", path: "/Card.jsx" }} state="result" result={{}} />);
    expect(screen.getByText("Editing /Card.jsx")).toBeTruthy();
  });

  it("shows 'Reading /App.jsx' for str_replace_editor view", () => {
    render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "view", path: "/App.jsx" }} state="result" result={{}} />);
    expect(screen.getByText("Reading /App.jsx")).toBeTruthy();
  });

  it("shows 'Renaming /old.jsx' for file_manager rename", () => {
    render(<ToolCallBadge toolName="file_manager" args={{ command: "rename", path: "/old.jsx" }} state="result" result={{}} />);
    expect(screen.getByText("Renaming /old.jsx")).toBeTruthy();
  });

  it("shows 'Deleting /App.jsx' for file_manager delete", () => {
    render(<ToolCallBadge toolName="file_manager" args={{ command: "delete", path: "/App.jsx" }} state="result" result={{}} />);
    expect(screen.getByText("Deleting /App.jsx")).toBeTruthy();
  });

  it("falls back to raw tool name for unknown tool", () => {
    render(<ToolCallBadge toolName="unknown_tool" args={{}} state="result" result={{}} />);
    expect(screen.getByText("unknown_tool")).toBeTruthy();
  });

  it("renders spinner when pending (no result)", () => {
    const { container } = render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/App.jsx" }} state="call" />);
    expect(container.querySelector(".animate-spin")).toBeTruthy();
    expect(container.querySelector(".bg-emerald-500")).toBeNull();
  });

  it("renders green dot when state is result with result", () => {
    const { container } = render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/App.jsx" }} state="result" result={{}} />);
    expect(container.querySelector(".bg-emerald-500")).toBeTruthy();
    expect(container.querySelector(".animate-spin")).toBeNull();
  });
});

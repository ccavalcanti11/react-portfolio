import { render, screen } from "@testing-library/react";
import ApolloWrapper from "@/components/ApolloWrapper";

describe("ApolloWrapper", () => {
  it("renders children inside the Apollo provider", () => {
    render(
      <ApolloWrapper>
        <p>Child content</p>
      </ApolloWrapper>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});

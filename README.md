# React Architecture Map

A ReactJS web page to create node & edge architectures via user command input.

## User Commands

1. <code>CREATE ARCH</code> (Creates a blank architecture, with no nodes and edges)
2. <code>ADD {NODE/EDGE}; id=..., position_x=..., position_y=..., label=...; </code> (Adds node/edge(s). Second argument onwards are successive multiple nodes)
3. <code>DELETE {NODE/EDGE}; id={id1}, {id2}, ... </code> (Delete node/edge(s). Second argument is a list of ID(s) to delete)

# Robustness

Users cannot enter any of the following
- Invalid/garbage commands
- Malicious (XSS syntax) commands
- Blank input

# Todo

- Implement EDIT function
- Auto-generate node and edge ID when adding
- Syntax coloring of code view
- Command history
- More Flow diagram interaction

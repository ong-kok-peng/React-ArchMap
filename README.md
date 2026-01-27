# React Architecture Map

A ReactJS web page to create node & edge architectures via user command input.

## User Commands

1. ```CREATE ARCH```
Creates a blank architecture, with no nodes and edges
2.
```
ADD {NODE/EDGE};
id=..., position_x=..., position_y=..., label=...
```
Adds node/edge(s). Second argument onwards are successive multiple nodes. Successive nodes can be separated in multiple lines as such:
```
id=id1, position_x=5, position_y=7, label=foo;
id=id2, position_x=10, position_y=17, label=foo bar;
id=id3, position_x=23, position_y=34, label=foo bar bar;
```
3. 
```
DELETE {NODE/EDGE};
id={id1}, {id2}, ...
```
Delete node/edge(s). Second argument is a list of ID(s) to delete

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

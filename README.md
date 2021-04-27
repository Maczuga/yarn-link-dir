# Simple mass npm/yarn link/unlink

--- 

### Example

--- 

Link all packages from directory `./packages` in another project:  
```yarn-link-dir yarn link ./packages ../../other-project```

Unlink all packages linked from directory `./packages` and restore original (from npm or something):  
```yarn-link-dir yarn unlink ./packages ../../other-project```

Args:
1. `npm` or `yarn` - selects which one you want to use.
2. `link` or `unlink`.
3. Path to directory that contains packages.
4. Path to directory containing project.

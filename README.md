# Simple mass yarn link/unlink

--- 

### Example

--- 

Link all packages from directory `./packages` in another project:  
```yarn-link-dir link ./packages ../../other-project```

Unlink all packages linked from directory `./packages` and restore original (from npm or something):  
```yarn-link-dir unlink ./packages ../../other-project```

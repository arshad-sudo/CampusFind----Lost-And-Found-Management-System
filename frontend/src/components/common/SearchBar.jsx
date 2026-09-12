import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Select, MenuItem, Divider } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBar = ({ onSearch, categories = [] }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ query, category });
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', maxWidth: 600, mx: 'auto', borderRadius: 8 }}
    >
      {categories.length > 0 && (
        <>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
            variant="standard"
            disableUnderline
            sx={{ ml: 2, minWidth: 120 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        </>
      )}
      <InputBase
        sx={{ ml: 2, flex: 1 }}
        placeholder="Search for items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton type="submit" sx={{ p: '10px' }} color="primary">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;

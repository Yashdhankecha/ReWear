import React from 'react';
import ListItemForm from './ListItem';

const ListItemPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-12 px-2 md:px-8">
      <div className="w-full max-w-lg">
        <ListItemForm />
      </div>
    </div>
  );
};

export default ListItemPage; 
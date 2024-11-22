import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton, Divider } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import "./CollapsibleSidebar.css"; // Optional for custom styles

const CollapsibleSidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Sidebar toggle button */}
      <IconButton className="sidebar-toggle" onClick={toggleSidebar}>
        <MenuIcon />
      </IconButton>

      {/* Collapsible Drawer */}
      <Drawer anchor="left" open={isOpen} onClose={toggleSidebar}>
        <div className="sidebar-header">
          <IconButton onClick={toggleSidebar}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button>
            <ListItemText primary="Personal Scheduling" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="To-Do List" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <div className="sidebar-content">{children}</div>
    </>
  );
};

export default CollapsibleSidebar;

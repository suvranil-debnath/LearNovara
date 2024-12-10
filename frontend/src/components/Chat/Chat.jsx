import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

class Chat extends Component {
  componentDidMount() {
    // Load Kommunicate script dynamically
    (function (d, m) {
      var kommunicateSettings = {
        appId: "2fbfb25aa4014d762190e1dda2b77fd24", // Replace with your App ID
        popupWidget: true,
        automaticChatOpenOnNavigation: true,
      };
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
  }

  componentWillUnmount() {
    // Remove Kommunicate widget when navigating away
    const chatWidget = document.getElementById("kommunicate-widget-iframe");
    if (chatWidget) {
      chatWidget.remove();
    }
    delete window.kommunicate;
  }

  render() {
    return null; // The component itself doesn't render anything
  }
}

export default Chat

import React, { useState } from "react";
import dynamic from 'next/dynamic'
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from 'axios';
import Router from 'next/router'
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import { Root, Header, Nav, Content, Footer, presets } from "mui-layout";

export default class DashboardView extends React.Component {
  constructor(props) {
      super(props)

      this.state = {
        
      }
  }

  componentDidMount() {
    
  }

  render() {
      
    return (
      <React.Fragment>
        <CssBaseline />
      </React.Fragment>
    )

  }
}
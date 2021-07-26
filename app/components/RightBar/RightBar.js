import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class RightBar extends React.Component {
  render() {
    return (
      <Grid item sm={4} md={4}>
        <div style={{ padding: 10, borderBottom: 'solid 1px lightgrey' }}>
          <h3>Trending</h3>
          <Typography>
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
          </Typography>
        </div>
      </Grid>
    );
  }
}

export default RightBar;

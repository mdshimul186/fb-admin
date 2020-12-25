import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import parse from 'html-react-parser';
import { Divide } from 'react-feather';

export default function Preview({ article, open, handleClosePreview }) {



  return (
    <div>

      <Dialog
        open={open}
        onClose={handleClosePreview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          <Typography variant='h3'>{article && article.title}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <section style={{textAlign:"center"}}>
            <img style={{maxHeight:"200px",objectFit:"contain"}} src={article && article.thumbnail}></img>
          </section>
            <section>

              <Typography variant='subtitle1'>{article && article.description}</Typography>

            </section>

            <section>

              {article && parse(article.body)}

            </section>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

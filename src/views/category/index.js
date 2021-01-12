import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@material-ui/core';
import Page from 'src/components/Page';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';


import axios from 'axios'
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  catContainer: {
    width: "500px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 20px"
  }
}));

const CaterogyList = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [backdrop, setBackdrop] = useState(false)

  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [edit, setEdit] = useState(null)

  useEffect(() => {
    setBackdrop(true)
    axios.get("/blogcategory/getcategory")
      .then(res => {
        setCategories(res.data.blogCategory)
        setBackdrop(false)
      })
      .catch(err=>{
        setBackdrop(false)
        err && err.response && alert(err.response.data.error)
      })
  }, [])




  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(null)
    setName('')
  };

  const handleEdit=(cat)=>{
    setEdit(cat)
    setName(cat.name)
    handleClickOpen()
  }

  const handleAdd=()=>{
    let data ={
      name
    }
    setBackdrop(true)
    axios.post('/blogcategory/create',data)
    .then(res=>{
      if(res.data.success){
        setCategories([...categories,res.data.blogCategory])
        handleClose()
        setBackdrop(false)
      }
    })
    .catch(err=>{
      setBackdrop(false)
      err && err.response && alert(err.response.data.error)
    })
  }

  const handleSaveEdit=(cat)=>{
    let data ={
      name
    }
    setBackdrop(true)
    axios.post('/blogcategory/edit/'+cat._id,data)
    .then(res=>{
      if(res.data.success){
        let temp = [...categories]
        let index = temp.findIndex(c=>c._id === cat._id)
        temp[index] = res.data.blogCategory
        setCategories(temp)
        handleClose()
        setBackdrop(false)
      }
    })
    .catch(err=>{
      setBackdrop(false)
      err && err.response && alert(err.response.data.error)
    })
  
  }

  const handleDelete=(id)=>{
    let consent = window.confirm('Are you sure')
    if(!consent) return
    setBackdrop(true)
    axios.delete('/blogcategory/delete/'+id)
    .then(res=>{
      if(res.data.success){
        let temp = [...categories]
        let index = temp.findIndex(c=>c._id === id)
        temp.splice(index,1)
        setCategories(temp)
        handleClose()
        setBackdrop(false)
      }
    })
    .catch(err=>{
      setBackdrop(false)
      err && err.response && alert(err.response.data.error)
    })
  }


  return (
    <>


      <div>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
         
        >
          <DialogTitle id="alert-dialog-title">Add Category</DialogTitle>
          <DialogContent>
            <TextField
              label="Category Name"
              type='text'
              fullWidth
              style={{width:"300px"}}
              onChange={(e)=>setName(e.target.value)}
              value={name}
              
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancle
          </Button>
          {
            edit ? <Button onClick={()=>handleSaveEdit(edit)} color="primary" autoFocus>
              Edit
          </Button>:
          <Button onClick={()=>handleAdd()} color="primary" autoFocus>
              Add
          </Button>
          }
            
          </DialogActions>
        </Dialog>
      </div>











      <Page
        className={classes.root}
        title="Categories"
      >

        <Container maxWidth={false}>
          <div>
            <Box display="flex" justifyContent="flex-end" >
              <Button
                color="primary"
                variant="contained"
                onClick={()=>handleClickOpen()}
              >
                Add Category
        </Button>
            </Box>

          </div>
          <Box style={{ background: "white" }} mt={3}>
            {
              categories.length > 0 ? categories.map((cat, index) => {
                return (
                  <div className={classes.catContainer} key={index}>
                    <Typography variant='subtitle2'>{cat.name}</Typography>
                    <div>
                      <IconButton onClick={() => handleEdit(cat)}><EditIcon /></IconButton>
                      <IconButton onClick={()=>handleDelete(cat._id)}><DeleteForeverIcon style={{ color: "red" }} /></IconButton>
                    </div>
                  </div>
                )
              }) :
                <p>No categories found</p>
            }
          </Box>
        </Container>
      </Page>

      <Backdrop style={{ zIndex: "99999" }} open={backdrop}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};

export default CaterogyList;

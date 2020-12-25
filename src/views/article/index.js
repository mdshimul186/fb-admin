import React,{useEffect,useState} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

//import Toolbar from './Toolbar';


import useTable from "../../components/useTable";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {Button,Toolbar, Paper, TableBody, TableRow, TableCell, InputAdornment ,TextField,IconButton} from '@material-ui/core';
import { Search } from "@material-ui/icons";
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios'
import moment from 'moment'
import Preview from './Preview'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3)
  },
  searchInput: {
    width: '50%'
  },
  newButton: {
    position: 'absolute',
    right: '10px'
  }
}));


const headCells = [
  { id: 'index', label: '#', disableSorting: true },
  { id: 'title', label: 'Title' },
  { id: 'category', label: 'Category' , disableSorting: true},
  { id: 'blog', label: 'Blog' , disableSorting: true},
  { id: 'views', label: 'views' },
  { id: 'status', label: 'status'},
  { id: 'date', label: 'Date', disableSorting: true},
  { id: 'actions', label: 'Actions', disableSorting: true }
]

const Articles = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [status, setStatus] = useState('')
  
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [selectedPreview, setSelectedPreview] = useState(null)

  const [records, setRecords] = useState([])
  const [recordsAll, setRecordsAll] = useState([])
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(records, headCells, filterFn);
  
  

  useEffect(()=>{
    axios.get('/admin/allarticles')
    .then(res=>{
      setRecords(res.data.articles)
      setRecordsAll(res.data.articles)
    })
  },[])

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
        fn: items => {
            if (target.value == "")
                return items;
            else
                return items.filter(x => x.title.toString().includes(target.value))
        }
    })
}

const handleClickOpen = (article) => {
  console.log(article)
  setSelectedArticle(article)
  setStatus(article.isApproved ? 'approve':'pending')
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
  setStatus('')
  setSelectedArticle(null)
};

const updateArticle=(id)=>{
  axios.patch('/admin/editarticle/'+id,{status})
  .then(res=>{
      if(res.data.success){
          let temp = [...records]
          let index = temp.findIndex(article=>article._id === id)
          temp[index] = res.data.article
          setRecords(temp)
          handleClose()
      }
  })
  .catch(err=>{
      console.log(err)
  })
}
//---------------preview
const handlePreview=(article)=>{
    setOpenPreview(true)
    setSelectedPreview(article)
}
const handleClosePreview=()=>{
    setOpenPreview(false)
    setSelectedPreview(null)
}
//--------------------delete
const handleDelete=(id)=>{
  let consent = window.confirm("Are you sure ?")
  if(consent){
    axios.delete('/admin/deletearticle/'+id)
    .then(res=>{
        if(res.data.success){
            let temp = [...records]
            let index = temp.findIndex(article=>article._id === id)
            temp.splice(index,1)
            setRecords(temp)
        }
    })
    .catch(err=>{
        console.log(err)
    })
  }
}


  return (
    <Page
      className={classes.root}
      title="Articles"
    >
    <Preview handleClosePreview={handleClosePreview} open={openPreview} article={selectedPreview} />
      <Container maxWidth={false}>
        <Paper className={classes.pageContent}>

          <Toolbar>
            <TextField
            variant='outlined'
              label="Enter article title"
              className={classes.searchInput}
              InputProps={{
                startAdornment: (<InputAdornment position="start">
                  <Search />
                </InputAdornment>)
              }}
              onChange={handleSearch}
            />
            
          </Toolbar>
          <TblContainer>
            <TblHead />
            <TableBody>
              {
                recordsAfterPagingAndSorting().map((item,index) =>
                (<TableRow key={item._id}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category? item.category.name:"N/A"}</TableCell>
                  <TableCell>{item.blog?item.blog.name:"N/A"}</TableCell>
                  <TableCell>{item.views}</TableCell>
                  <TableCell>{item.isApproved ? 'Approved':'Pending'}</TableCell>
                  <TableCell>{moment(item.createdAt).fromNow()}</TableCell>
                 
                  <TableCell>
                  <div style={{display:"flex"}}>
                    <IconButton
                      color="default"
                      onClick={() => handlePreview(item)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleClickOpen(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(item._id)}>
                      <DeleteForeverIcon style={{color:"red"}} />
                    </IconButton>
                   </div>
                  </TableCell>
                </TableRow>)
                )
              }
            </TableBody>
          </TblContainer>
          <TblPagination />
        </Paper>
      </Container>




      <div>
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Update Article</DialogTitle>
        <DialogContent>
        <InputLabel id="demo-simple-select-label">Article status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status}
          onChange={(e)=>setStatus(e.target.value)}
          style={{width:"300px"}}
        >
          <MenuItem value='approve'>Approve</MenuItem>
          <MenuItem value='pending'>Pending</MenuItem>
        </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancle
          </Button>
          <Button onClick={()=>updateArticle(selectedArticle._id)} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </Page>
  );
};

export default Articles

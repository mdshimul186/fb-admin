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
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';


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
  { id: 'creator', label: 'Creator' , disableSorting: true},
  { id: 'date', label: 'Date', disableSorting: true},
  { id: 'actions', label: 'Actions', disableSorting: true }
]

const Blogs = () => {
  const classes = useStyles();
  
  const [backdrop, setBackdrop] = useState(false)
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
    setBackdrop(true)
    axios.get('/blog/allblogs')
    .then(res=>{
      setRecords(res.data.blog)
      setRecordsAll(res.data.blog)
      setBackdrop(false)
    })
    .catch(err=>{
      setBackdrop(false)
      err && err.response && alert(err.response.data.error)
    })
  },[])

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
        fn: items => {
            if (target.value == "")
                return items;
            else
                return items.filter(x => x.name.toString().includes(target.value))
        }
    })
}






//--------------------delete
const handleDelete=(id)=>{
  let consent = window.confirm("Are you sure ?")
  if(consent){
    setBackdrop(true)
    axios.delete('/admin/deleteblog/'+id)
    .then(res=>{
        if(res.data.success){
            let temp = [...records]
            let index = temp.findIndex(blog=>blog._id === id)
            temp.splice(index,1)
            setRecords(temp)
            setBackdrop(false)
        }
    })
    .catch(err=>{
      setBackdrop(false)
      err && err.response && alert(err.response.data.error)
    })
  }
}


  return (
    <Page
      className={classes.root}
      title="Articles"
    >

      <Container maxWidth={false}>
        <Paper className={classes.pageContent}>

          <Toolbar>
            <TextField
            variant='outlined'
              label="Enter blog name"
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
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.creator.first} {item.creator.last}</TableCell>
                 
                  <TableCell>{moment(item.createdAt).fromNow()}</TableCell>
                 
                  <TableCell>
                  <div style={{display:"flex"}}>
                    
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



      <Backdrop style={{ zIndex: "99999" }} open={backdrop}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Page>
  );
};

export default Blogs

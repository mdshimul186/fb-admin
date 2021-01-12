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
import {Button,Toolbar, Paper, TableBody, TableRow, TableCell, InputAdornment ,TextField,IconButton,Avatar,Switch } from '@material-ui/core';
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
  { id: 'profile', label: 'Profile', disableSorting: true },
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' , disableSorting: true},
  
  { id: 'role', label: 'Role', disableSorting: true},
  { id: 'status', label: 'Status', disableSorting: true},
  { id: 'date', label: 'Joined', disableSorting: true},
  { id: 'actions', label: 'Actions', disableSorting: true }
]

const Users = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false)
  const [backdrop, setBackdrop] = useState(false)
  const [suspended, setSuspended] = useState(false)
  
  const [selectedUser, setSelectedUser] = useState(null)
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
    setBackdrop(true)
    axios.get('/admin/users')
    .then(res=>{
      setRecords(res.data.users)
      setRecordsAll(res.data.users)
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
                return items.filter(x => x.first.toString().includes(target.value))
        }
    })
}

const handleClickOpen = (user) => {

  setSelectedUser(user)
  setSuspended(user.isSuspended)
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
  setSuspended('')
  setSelectedUser(null)
};

const updateUser=(id)=>{
  setBackdrop(true)
  axios.patch('/admin/updateuser/'+id,{isSuspended:suspended})
  .then(res=>{
      if(res.data.success){
          let temp = [...records]
          let index = temp.findIndex(user=>user._id === id)
          temp[index] = res.data.user
          setRecords(temp)
          handleClose()
          setBackdrop(false)
      }
  })
  .catch(err=>{
    setBackdrop(false)
    err && err.response && alert(err.response.data.error)
  })
}



const handleSuspended = (e)=>{
setSuspended(e.target.checked)
}


  return (
    <Page
      className={classes.root}
      title="Users"
    >
  
      <Container maxWidth={false}>
        <Paper className={classes.pageContent}>

          <Toolbar>
            <TextField
            variant='outlined'
              label="Enter user name"
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
                  <TableCell><Avatar src={item.profileimg} /></TableCell>
                  <TableCell>{item.first} {item.last}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.isSuspended? 'Suspended':"Active"}</TableCell>
                  <TableCell>{moment(item.date).fromNow()}</TableCell>
                 
                  <TableCell>
                  <div style={{display:"flex"}}>
                    {
                      item.role === 'user' ?<IconButton
                      color="primary"
                      onClick={() => handleClickOpen(item)}>
                      <EditIcon />
                    </IconButton>:
                    <p>Not allowed</p>
                    }
                      

                    {/* <Switch
                      checked={item.isSuspended}
                      onChange={handleSuspended}
                    /> */}
                    
                    {/* <IconButton
                      onClick={() => handleDelete(item._id)}>
                      <DeleteForeverIcon style={{color:"red"}} />
                    </IconButton> */}
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
        <DialogTitle id="alert-dialog-title">Update User</DialogTitle>
        <DialogContent style={{width:"300px"}}>
        <InputLabel>Suspend user ?</InputLabel>
        <Switch
            checked={suspended}
            onChange={handleSuspended}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancle
          </Button>
          <Button onClick={()=>updateUser(selectedUser._id)} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div> 


   


    <Backdrop style={{ zIndex: "99999" }} open={backdrop}>
        <CircularProgress color="primary" />
      </Backdrop>

    </Page>
  );
};

export default Users

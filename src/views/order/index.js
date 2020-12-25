import React,{useEffect,useState} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
//import Toolbar from './Toolbar';
import data from './data';
import OrderTable from './OrderTable'
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
  { id: 'orderId', label: 'Order Id' },
  { id: 'total', label: 'Amount' },
  { id: 'name', label: 'Full Name' },
  { id: 'method', label: 'Payment Method' ,disableSorting: true},
  { id: 'paymentDetails', label: 'Trx/Email',disableSorting: true },
  { id: 'status', label: 'Status',disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

const OrderList = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [status, setStatus] = useState('')
  const [customers] = useState(data);
  const [records, setRecords] = useState([])
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(records, headCells, filterFn);
  
  

  useEffect(()=>{
    axios.get('/order/allorders')
    .then(res=>{
      setRecords(res.data.order)
    })
  },[])

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
        fn: items => {
            if (target.value == "")
                return items;
            else
                return items.filter(x => x.orderId.toString().includes(target.value))
        }
    })
}

const handleClickOpen = (order) => {
  setSelectedOrder(order)
  setStatus(order.status)
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
  setStatus('')
  setSelectedOrder(null)
};

const saveOrder=(id)=>{
  axios.patch('/order/update/'+id,{status})
  .then(res=>{
      if(res.data.success){
          let temp = [...records]
          let index = temp.findIndex(order=>order._id === id)
          temp[index] = res.data.order
          setRecords(temp)
          handleClose()
      }
  })
  .catch(err=>{
      console.log(err)
  })
}


  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Paper className={classes.pageContent}>

          <Toolbar>
            <TextField
            variant='outlined'
              label="Enter Order Id"
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
                recordsAfterPagingAndSorting().map(item =>
                (<TableRow key={item._id}>
                  <TableCell>{item.orderId}</TableCell>
                  <TableCell>{item.total}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.paymentMethod}</TableCell>
                  <TableCell>{item.paymentDetails}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleClickOpen(item)}>
                      <EditIcon />
                    </IconButton>
                   
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
        <DialogTitle id="alert-dialog-title">Update status</DialogTitle>
        <DialogContent>
        <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status}
          onChange={(e)=>setStatus(e.target.value)}
          style={{width:"300px"}}
        >
          <MenuItem value='processing'>Processing</MenuItem>
          <MenuItem value='completed'>Completed</MenuItem>
          <MenuItem value='cancelled'>Cancelled</MenuItem>
        </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancle
          </Button>
          <Button onClick={()=>saveOrder(selectedOrder._id)} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </Page>
  );
};

export default OrderList;

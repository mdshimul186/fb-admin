import React, { useEffect, useState } from 'react';
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
import { Button, Toolbar, Paper, TableBody, TableRow, TableCell, InputAdornment, TextField, IconButton } from '@material-ui/core';
import { Search } from "@material-ui/icons";
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios'
import moment from 'moment'
import Preview from './Preview'
import { Editor } from '@tinymce/tinymce-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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
  },
  thumbnail: {
    height: "110px", width: "200px", border: "1px solid #ccc", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "16px", fontWeight: "bold", margin: "20px", cursor: "pointer", backgroundSize: "cover"
  }
}));


const headCells = [
  { id: 'index', label: '#', disableSorting: true },
  { id: 'title', label: 'Title' },
  { id: 'category', label: 'Category', disableSorting: true },
  { id: 'blog', label: 'Blog', disableSorting: true },
  { id: 'views', label: 'views' },
  { id: 'status', label: 'status' },
  { id: 'date', label: 'Date', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true }
]

const Articles = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [backdrop, setBackdrop] = useState(false)
  const [status, setStatus] = useState('')

  const [selectedArticle, setSelectedArticle] = useState(null)
  const [selectedPreview, setSelectedPreview] = useState(null)


  //Editor
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [body, setBody] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [selectedThumbnail, setSelectedThumbnail] = useState(null)
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])

  const [records, setRecords] = useState([])
  const [recordsAll, setRecordsAll] = useState([])
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(records, headCells, filterFn);



  useEffect(() => {
    setBackdrop(true)
    axios.get('/admin/allarticles')
      .then(res => {
        setRecords(res.data.articles)
        setRecordsAll(res.data.articles)
        setBackdrop(false)
      })
      .catch(err=>{
        setBackdrop(false)
        err && err.response && alert(err.response.data.error)
      })
  }, [])

  useEffect(() => {
    setBackdrop(true)
    axios.get('/blogcategory/getcategory')
      .then(res => {
        if (res.data.success) {
          setCategories(res.data.blogCategory)
          setBackdrop(false)
        }
      })
      .catch(err=>{
        setBackdrop(false)
        err && err.response && alert(err.response.data.error)
      })
  }, [])

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

    setSelectedArticle(article)
    setTitle(article.title)
    setDescription(article.description)
    setBody(article.body)
    setThumbnail(article.thumbnail)
    setTags(article.tags)
    setCategory(article.category._id)
    setStatus(article.isApproved ? 'approve' : 'pending')
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('')
    setDescription('')
    setBody('')
    setThumbnail('')
    setTags('')
    setSelectedThumbnail(null)
    setCategory('')
    setStatus('')
    setSelectedArticle(null)
  };

  const updateArticle = (id) => {
    if (!title || !description || !status || !category) {
      return alert("Title, description, category, status are required")
    }
    setBackdrop(true)
    let formData = new FormData()
    formData.append('title', selectedArticle.title === title ? null : title)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('status', status)
    formData.append('body', body)
    formData.append('thumbnailedit', selectedThumbnail ? selectedThumbnail : null)
    formData.append('tags', tags)


    axios.patch('/admin/editarticle/' + id, formData)
      .then(res => {
        if (res.data.success) {
          let temp = [...records]
          let index = temp.findIndex(article => article._id === id)
          temp[index] = res.data.article
          setRecords(temp)
          setRecordsAll(temp)
          handleClose()
          setBackdrop(false)
        }
      })
      .catch(err=>{
        setBackdrop(false)
        err && err.response && alert(err.response.data.error)
      })
  }
  //---------------preview
  const handlePreview = (article) => {
    setOpenPreview(true)
    setSelectedPreview(article)
  }
  const handleClosePreview = () => {
    setOpenPreview(false)
    setSelectedPreview(null)
  }
  //--------------------delete
  const handleDelete = (id) => {
    let consent = window.confirm("Are you sure ?")
    if (consent) {
      setBackdrop(false)
      axios.delete('/admin/deletearticle/' + id)
        .then(res => {
          if (res.data.success) {
            let temp = [...records]
            let index = temp.findIndex(article => article._id === id)
            temp.splice(index, 1)
            setRecords(temp)
            setRecordsAll(temp)
            setBackdrop(false)
          }
        })
        .catch(err=>{
          setBackdrop(false)
          err && err.response && alert(err.response.data.error)
        })
    }
  }


  const handleEditorChange = (content, editor) => {
    setBody(content)
  }


  //filter Status
  const [value, setValue] = useState('all');

  const handleChangeStatus = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    if(value === 'all'){
      setRecords(recordsAll)
    }else if(value === 'approved'){
      let filtered = recordsAll.filter(item=>item.isApproved === true)
      setRecords(filtered)
    }else if(value === 'pending'){
      let filtered = recordsAll.filter(item=>item.isApproved === false)
      setRecords(filtered)
    }
  }, [value])


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
            <FormControl component="fieldset">
                  
                  <RadioGroup style={{display:"flex",flexDirection:"row",marginLeft:"10px"}} aria-label="status" name="status" value={value} onChange={handleChangeStatus}>
                    <FormControlLabel value="all" control={<Radio />} label="All" />
                    <FormControlLabel value="approved" control={<Radio />} label="Approved" />
                    <FormControlLabel value="pending" control={<Radio />} label="Pending" />
                   
                  </RadioGroup>
              </FormControl>
          </Toolbar>
          <TblContainer>
            <TblHead />
            <TableBody>
              {
                recordsAfterPagingAndSorting().map((item, index) =>
                (<TableRow key={item._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category ? item.category.name : "N/A"}</TableCell>
                  <TableCell>{item.blog ? item.blog.name : "N/A"}</TableCell>
                  <TableCell>{item.views}</TableCell>
                  <TableCell>{item.isApproved ? 'Approved' : 'Pending'}</TableCell>
                  <TableCell>{moment(item.createdAt).fromNow()}</TableCell>

                  <TableCell>
                    <div style={{ display: "flex" }}>
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
                        <DeleteForeverIcon style={{ color: "red" }} />
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
          maxWidth='xl'
        >
          <DialogTitle id="alert-dialog-title">Edit Article</DialogTitle>
          <DialogContent>


            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 0" }}>
              <div style={{ width: "70%" }}>
                <TextField value={title} onChange={(e) => setTitle(e.target.value)} fullWidth id="standard-basic" variant='outlined' label="Enter title" />
                <TextField style={{ marginTop: "10px" }} value={description} onChange={(e) => setDescription(e.target.value)} fullWidth id="standard-basic" variant='outlined' label="Enter description" />
                <InputLabel style={{ marginTop: "15px" }} id="demo-simple-select-label">Select category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  fullWidth
                  variant='outlined'
                  style={{ marginTop: "5px" }}
                >
                  {
                    categories && categories.map(cat => {
                      return (
                        <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                      )
                    })
                  }
                </Select>
              </div>
              <div style={{ width: "30%" }}>
                <div className={classes.thumbnail} style={selectedThumbnail ? { backgroundImage: `url(${URL.createObjectURL(selectedThumbnail)})` } : thumbnail ? { backgroundImage: `url(${thumbnail})` } : null}>
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    name="file"
                    onChange={(e) => setSelectedThumbnail(e.target.files[0])}
                    id="file" />
                  <label htmlFor="file"><i className="fas fa-upload"></i> Upload Your Image</label>
                </div>
                <div style={{ marginTop: "5px", marginLeft: "10px" }}>
                  <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                    variant='outlined'
                  >
                    <MenuItem value='approve'>Approve</MenuItem>
                    <MenuItem value='pending'>Pending</MenuItem>
                  </Select>
                </div>
              </div>
            </div>


            <Editor
              initialValue="<p></p>"
              apiKey="91als7opdgzbord7g1svxmwnzu364m2bj3nc5n1wzrzj0hnr"
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code imagetools wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | link image media \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat |',
                automatic_uploads: true,
                relative_urls: false,
                images_upload_url: "/article/articleimages",
                images_upload_handler: function (blobinfo, success, failure) {
                  let headers = new Headers()
                  headers.append('Accept', 'Application/JSON')

                  let formData = new FormData()
                  formData.append("articleimages", blobinfo.blob(), blobinfo.filename())

                  axios.post('/article/articleimages', formData)
                    .then(res => {
                      success(res.data.imgUrl)
                    })
                    .catch(() => failure('http error'))
                }
              }}
              onEditorChange={handleEditorChange}
              value={body}

            />

            <TextField
              style={{ marginTop: "10px" }}
              fullWidth
              id="standard-basic"
              variant='outlined'
              label="Enter tags"
              placeholder='tag1,tag2,tag3...'
              value={tags}
              onChange={(e) => setTags(e.target.value)}

            />

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              Cancle
            </Button>
            <Button onClick={() => updateArticle(selectedArticle._id)} color="primary">
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

export default Articles

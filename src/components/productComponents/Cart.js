import React ,{useState,useEffect,useContext} from 'react';
// import StripeCheckout from 'react-stripe-checkout';
import axios from "axios";
import { database } from '../../firebase';
import styled from "styled-components";
import { Grid, makeStyles, Typography,useTheme,useMediaQuery,Button ,TextField,MenuItem,InputLabel, Dialog,DialogContent} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';
import { toast } from 'react-toastify';
import { StateContext } from '../../context/StateContext';
import { Link } from 'react-router-dom';
// import database  from '../../firebase';

const useStyles = makeStyles(theme=>({
    rowContainer:{
        paddingLeft:'4em',
        paddingRight:'4em',
        paddingTop:'2em',
        paddingBottom:'10em',
        [theme.breakpoints.down('md')]:{
            paddingLeft:'1.5em',
            paddingRight:'1.5em',
        },
        [theme.breakpoints.down('sm')]:{
            paddingLeft:'1.5em',
            paddingRight:'1.5em',
            paddingTop:'1em',
        }
    },
    root: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
        marginLeft:'auto'
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    esitmate:{
        ...theme.typography.estimate,
        fontSize:'1.5rem',
        backgroundColor:theme.palette.common.orange,
        borderRadius:50,
        height: 80,
        width: 205,
        marginRight:'5em',
        marginLeft:'2em',
        '&:hover':{
            backgroundColor:theme.palette.secondary.light
        },
        [theme.breakpoints.down("md")]: {
            marginLeft: 0,
            marginRight: 0
          }
    },
    learnButton: {
        ...theme.typography.learnButton,
        fontSize: "0.7rem",
        height: 35,
        padding: 5,
        [theme.breakpoints.down("md")]: {
          marginBottom: "2em"
        }
    },
    message:{
        border: `2px solid ${theme.palette.common.black}`,
        marginTop:'3em',
        borderRadius:5
    },
    sendButton:{
        ...theme.typography.estimate,
        borderRadius:50,
        height:45,
        width:245,
        fontSize:'1rem',
        color:'white',
        backgroundColor:'#51CCCC',
        "&:hover":{
            backgroundColor:'#69DADB'
        },
        [theme.breakpoints.down("sm")]: {
            height: 40,
            width: 225,
          }
    }
    
}))
export default function Cart(props){
    const classes = useStyles();
    const theme = useTheme();
    const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
    const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
    const matchesXS = useMediaQuery(theme.breakpoints.down('xs'));

    // context
    const {cart,userdata,wish,cartsave,carttotal,addr} =  useContext(StateContext);
    const [dataCart] =  cart;
    const [user] = userdata;
    const [dataWishlist] = wish;
    const [cartSave] = cartsave;
    const [cartTotal] = carttotal;
    const ide = user;
    const [add] = addr;


    // state
    const [tot, setTot] = useState(0)
    // const [sav, setSave] = useState(0)
    // const [docs, setDocs] = useState([]);
    // const [quantity, setQuantity] = useState(1);

    const [open,setOpen] = useState(false);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [emailHelper,setEmailHelper] = useState('');
    const [phone,setPhone] = useState('');
    const [phoneHelper,setPhoneHelper] = useState('');
    const [pincode,setPincode] = useState('');
    const [pincodeHelper,setPincodeHelper] = useState('');
    const [city,setCity] = useState('');
    const [state,setState] = useState('');
    const [address,setAddress] = useState('');
    const [message,setMessage] = useState('');

   
    // const [amount, setAmount] = useState()

    // const [product] = React.useState({
    //    name: "Purchase",
    //    description: dataCart
    // });
    // // useeffest
    // useEffect(() => {
    //    console.log({dataCart})
    //   tote()

    // }, [tot])

    // delete
    const deleteItem = async(id, e) => {
        await database.collection('users')
        .doc(ide)
        .collection('cart')
        .doc(id)
        .delete()
        .then(() => { 

            toast("Product Deleted", {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
        })}
        )
    }
    // add to whistlist
    const addtoWish = (doc) => {
        let q = dataWishlist.filter(a => a.productName === doc.productName)
        if (ide) {
            if (q.length === 0) {
                database.collection("users").doc(ide).collection("wish").add({
                    productName: doc.productName,
                    image: doc.image,
                    price: doc.price,
                    oldPrice: doc.oldPrice
                }).then(() => {
                    toast("Item Added to WishList",
                        {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                })
                database.collection('users').doc(ide).collection('cart').doc(doc.key).delete()
            }
            else {
                toast("Product Moved To Wishlist", {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })

            }
        }
        else {
            toast.warn("Please Login First")
        }
    }

     // on submit data
     const submit = () => {
        database.collection('users').doc(ide).collection('shipping').add(
            {
                name,
                email,
                phone,
                pincode,
                city,
                state,
                address,
                message,
                cartTotal
            }
        )
    }
    
    // total
    // function tote() {
    //     database.collection('users').doc(ide).collection('cart').onSnapshot((a) => {
    //         let total =0;
    //         let save =0;
    //         a.forEach((item) => {
    //             total = total + Number(item.data().price)
    //             save = save + Number(item.data().oldPrice - item.data().price)
    //         })
    //         setSave(save)
    //         setTot(total)
    //     })
    // }
    
    const onChange = event => {
        let valid;

        switch(event.target.id)
        {
            case 'email' :
                setEmail(event.target.value);
                valid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value);

                if(!valid){
                    setEmailHelper('Invaild email');
                }else
                {
                    setEmailHelper('');
                }
                break;
            case 'phone' :
                setPhone(event.target.value)
                valid = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(event.target.value);

                if(!valid) {
                    setPhoneHelper('Invalid phone')
                }else{
                    setPhoneHelper('')
                }
                break;
            case 'pincode' :
                setPincode(event.target.value)
                valid = /^\d{6}$/.test(event.target.value);

                if(!valid) {
                    setPincodeHelper('Invalid Pincode')
                }else{
                    setPincodeHelper('')
                }
                break;

                default :
                break;
        }
    }
   
  
    
    const OriginalPrice = styled.span`
    text-decoration: line-through;
    font-size: 15px;
    font-weight: 100;
    color: #7e818c;
    padding: 0 0.2rem;
    `;


      if (dataCart.length === 0 )
      return (
          <div>
          {props.user ?
          <img src={`https://images.bewakoof.com/images/doodles/empty-cart-page-doodle.png`} alt="Logo" style={{ width: 150,alignContent:'center'}} />
          : 'sign ifrst' }
          </div>
      )
  else if (dataCart !== null)
    return(
        <div>
        {props.user ? 
        <Grid Container direction={matchesSM ? 'column' :' row' }  alignItems='center' className={classes.rowContainer}>
            <Grid item container direction='row' justifyContent='center'>
            <Grid item lg={4}>
                {/* first Item */}
                {dataCart && dataCart.map(doc=>
            <Card className={classes.root} style={{marginBottom:'2em'}}>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                    {doc.productName}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                    ₹{doc.price} 
                    <OriginalPrice id="price">{doc.oldPrice}</OriginalPrice>
                    </Typography>
                    <Typography variant="subtitle1" style={{color:'green'}}>
                    You saved ₹{doc.oldPrice - doc.price}!
                    </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                    <IconButton onClick={()=>deleteItem(doc.key)} >
                        <DeleteIcon/>
                    </IconButton>
                    <IconButton onClick={()=>addtoWish(doc)} >
                        <FavoriteIcon/>
                    </IconButton>
                    </div>
                </div>
                <CardMedia
                    className={classes.cover}
                    image={doc.image}
                    title="Live from space album cover"
                />
                </Card>
                )
                }
            </Grid>
            <Grid item lg={5} sm={8} xs={7} style={{marginLeft:matchesMD ? 0 :'8em'}} alignItems='center'  >
            <Card style={{ backgroundColor: '#F6F6F7' }}>
                        <CardContent>
                            <Typography style={{ backgroundColor: '#F6F6F7', color: 'black', fontFamily: "cursive", borderBottom: 'solid ' }}>
                                Subtotal
                            </Typography>
                            <br />
                            <Typography style={{ color: 'black', fontFamily: "fantasy" }}>
                                The total Price is ₹{cartTotal}
                            </Typography>
                            <Typography style={{ color: 'black', fontFamily: "fantasy" }}>
                                    You Saved ₹{cartSave}
                                </Typography>
                            <br />

                            {add.length === 0 ? <Button onClick={() => setOpen(true)} style={{ backgroundColor: '#506D84' }}>
                                            Add Address
                                        </Button> :
                                            <Button component={Link} to='/Checkout' style={{ backgroundColor: 'red' }}>Go To checkout</Button>

                                        }
                            {/* <Button onClick={() => setOpen(true)} style={{ backgroundColor: 'orange' }}>
                                            Checkout
                            </Button> */}
                            {/* <StripeCheckout stripeKey='pk_test_51JOzfFSGs3WteDI290yrM0bhrCjRDXsZISCi8PVHG45isfw7CN09fsOooDB99yl042wgNGVE1G9p8a6sLo5MC1ZD00PovwK3x6'
                            token={handleToken}
                            cartTotal={cartTotal * 100}
                            name="Payment"
                            // billingAddress
                            // shippingAddress
                        >
                        <Button variant='contained' style={{backgroundColor:'#DA0037'}}>
                            <Typography variant='h6' style={{color:'#EDEDED'}}>pay with card</Typography>
                        </Button>
                        </StripeCheckout> */}
                        </CardContent>
                    </Card>
            </Grid>
            </Grid>
            {/* diaglog model */}
            <Dialog open={open} 
            onClose={()=>setOpen(false)}  
            style={{ zIndex: 1302 }}
            maxWidth='lg'
                fullScreen={matchesSM}
                PaperProps={{
                    style: {
                      paddingTop: matchesXS ? "1em" : "1em",
                      paddingBottom: matchesXS ? "1em" : "5em",
                      paddingLeft: matchesXS
                        ? 0
                        : matchesSM
                        ? '5em'
                        : matchesMD
                        ? "10em"
                        : "10em",
                      paddingRight: matchesXS
                        ? 0
                        : matchesSM
                        ? '5em'
                        : matchesMD
                        ? "10em"
                        : "10em"
                    }
                  }}>
            <Grid>
            <DialogContent >
                    <Grid container direction='column'>
                        <Grid item>
                            <Typography align="left" variant="h4" style={{color:'black'}} gutterBottom>
                                Add Address
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography align="left" variant="h5" style={{color:'black',fontWeight:200}} gutterBottom>
                               <u> Delivery Info</u>
                            </Typography>
                        </Grid>

                        <Grid item style={{marginBottom:'0.5em'}}>
                                <TextField 
                                    label='Name'
                                    id='name'
                                    fullWidth
                                    value={name}
                                    onChange={(e)=>setName(e.target.value)}
                                />
                            </Grid>
                            <Grid item style={{marginBottom:'0.5em'}}>
                                <TextField 
                                    label='Email'
                                    error={emailHelper.length !== 0}
                                    helperText={emailHelper}
                                    id='email'
                                    fullWidth
                                    value={email}
                                    onChange={onChange}
                                />
                            </Grid>
                            <Grid item style={{marginBottom:'0.5em'}}>
                                <TextField 
                                    label='Phone' 
                                    error= {phoneHelper.length !== 0}
                                    helperText={phoneHelper}
                                    id='phone'
                                    fullWidth
                                    value={phone}
                                    onChange={onChange}
                                />
                            </Grid>
                            <Grid item>
                            <Typography align="left" variant="h5" style={{marginTop:'2em',marignBottom:'2em',color:'black',fontWeight:200}} gutterBottom>
                               <u> Address </u>
                            </Typography>
                        </Grid>
                            <Grid item style={{marginBottom:'0.5em'}}>
                                <TextField 
                                    label='Pincode' 
                                    error= {pincodeHelper.length !== 0}
                                    helperText={pincodeHelper}
                                    id='pincode'
                                    fullWidth
                                    value={pincode}
                                    onChange={onChange}
                                />
                            </Grid>
                            <Grid item style={{marginBottom:'0.5em'}}>
                                <TextField 
                                    label='City' 
                                    // error= {phoneHelper.length !== 0}
                                    // helperText={phoneHelper}
                                    id='city'
                                    fullWidth
                                    value={city}
                                    onChange={(e)=>setCity(e.target.value)}
                                />
                            </Grid>
                            <Grid item style={{marginBottom:'0.5em'}}>
                                <TextField 
                                    label='State' 
                                    // error= {phoneHelper.length !== 0}
                                    // helperText={phoneHelper}
                                    id='state'
                                    fullWidth
                                    value={state}
                                    onChange={(e)=>setState(e.target.value)}
                                />
                            </Grid>
                            <Grid item style={{marginBottom:'0.5em'}}>
                                <TextField 
                                    label='Addresss' 
                                    // error= {phoneHelper.length !== 0}
                                    // helperText={phoneHelper}
                                    id='state'
                                    fullWidth
                                    value={address}
                                    onChange={(e)=>setAddress(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid item style={{ width: matchesSM ? '100%' :matchesMD ? '25em': "30em" }} >
                            <TextField
                                InputProps={{disableUnderline:true}}
                                value={message}
                                placeholder='Tell us more about your Address'
                                multiline
                                fullWidth
                                rows={5}
                                id='message'
                                onChange={(e)=>setMessage(e.target.value)}
                                className={classes.message}
                            />
                        </Grid>
                        <Grid 
                            item 
                            container
                            direction={matchesSM ? 'column' : 'row'}
                            style={{marginTop:'2em'}}
                            alignItems='center'
                            justifyContent='center'
                        >
                            <Grid item>
                                <Button 
                                    style={{fontWeight:300,color:'#51CCCC'}}
                                    onClick={()=>setOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        <Grid item>
                        <Button 
                        component={Link} to='/Checkout'
                                disabled={
                                    name.length === 0 ||
                                    email.length === 0 ||
                                    phone.length === 0 ||
                                    message.length === 0 ||
                                    phoneHelper.length !== 0 ||
                                    emailHelper.length !== 0 ||
                                    pincodeHelper.length !==0 ||
                                    pincode ==0 ||
                                    address == 0 ||
                                    state == 0 ||
                                    city ==0
                                    }
                                variant='contained' 
                                className={classes.sendButton}
                                onClick={submit}
                            >
                             Save
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Grid>
        </Dialog>
        </Grid>
            : 'sign first' }
            </div>
    )
}

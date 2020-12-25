
let init ={
    userData:{},
    authenticated: false,
    snack:{open:false,message:"",type:''}
}

const authReducer = (state=init, action)=>{
    switch (action.type) {
        case "SET_USER":
       return{
           ...state,
           userData:action.payload,
           authenticated: true
        }
        case "SET_AUTHENTICATE":
       return{
           ...state,
           authenticated: true
        }
        case "LOGOUT":
        return{
            userData:{},
            authenticated: false,
            snack:{open:false,message:"",type:''}
            }
        case "SNACKBAR":
            return{
                ...state,
                snack:action.payload
            }


            
    
        default:
            return state;
    }
}

export default authReducer
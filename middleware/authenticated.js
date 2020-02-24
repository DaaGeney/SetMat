export default function ({app,  store, redirect }) {
    // If the user is not authenticated
 
    const cookiesRes = app.$cookies.get('auth')
    console.log(!cookiesRes)
    if (!cookiesRes ) {

       return redirect('/login')
    }
  }
  
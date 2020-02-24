export default function ({app,  store, redirect }) {
    // If the user is not authenticated
 
    const cookiesRes = app.$cookies.get('auth')

    if (!cookiesRes ) {

       return redirect('/login')
    }
  }
  
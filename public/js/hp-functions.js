
$(document).ready(function() {
  $("#home-loader").css("display","none")
})
// animation - clost and open popup login
$(".enter,#popLogin").click(function() {
  $("#head-text").text("התחברות");
  $("#facebook-text").text("התחבר דרך חשבון פייסבוק")
  $("#google-text").text("התחבר דרך חשבון גוגל")
  $("#email-text").text(" התחבר באמצעות טלפון")
  $("#warp-acc").css("display","none")
  $("#login-popup").fadeIn();
  $("#login-content").fadeIn();
});
$("#regCTA,.reg").click(function() {
  $("#head-text").text("הרשמה חינם");
  $("#facebook-text").text("הרשם דרך חשבון פייסבוק")
  $("#google-text").text("הרשם דרך חשבון גוגל")
  $("#email-text").text(" הרשם באמצעות טלפון")
  $("#warp-acc").css("display","block")
    $("#login-popup").fadeIn();
    $("#login-content").fadeIn();
});
$("#head img").click(function() {
    $("#login-popup").fadeOut();
    $("#login-content").fadeOut();
});
$("#phone-login").click(function() {
    $("#login-content").fadeOut();
    $("#regform").fadeIn();
});
$(".backbutton").click(function() {
    $("#regform").fadeOut();
    $("#login-content").fadeIn();
});
$("#have-acc-login").click(function() {
  $(".enter").trigger('click')
})

$("#phone-login").hover(function(){
  $(".fa-phone").css("color", "green");
  }, function(){
  $(".fa-phone").css("color", "black");
});



//general parms & functions 
function redirect(userId) {
  auth.onAuthStateChanged(function (userId) {
  dataBase.ref('users/' + userId.uid ).once('value').then(function (snap) {
    
    if(snap.val().Guest == ""){
     window.location.href = "/user.html"
    }else{
    window.location.href = "/profile.html"
    }
  })
})
  
  }
  
 // parms for email and pw
// let email = document.getElementById('emailreg').value;
// let pass = document.getElementById('passreg').value;

// set all parms when user register
function register(fullName,email,userImage,displayName,area,phone,gender) {

  let userId = auth.currentUser;
  dataBase.ref('users/' + userId.uid).set({
    Name:fullName === undefined ? "" : fullName,
    Email: email === undefined ? "" : email,
    Photo: userImage === undefined ? "" : userImage, 
    Display:displayName === undefined ? "" : displayName,
    CityName:area  === undefined ? "" : area,
    HusbandName: '',
    WifeName: '',
    Phone: phone === undefined ? "" : phone,
    HusbandArea: '',
    WifeArea: '',
    Guest:'',
    Tutorial:0,
    Date: '',    
    Gender: gender === undefined ? "" : gender,
    FemalePhoto:'',
    MalePhoto:''


  })

  dataBase.ref('users/' + userId.uid + '/CurrentWed').set({
    hall: '',
    light: '',
    design: '',
    photography: '',
    wedmovie: '',
    album: '',
    magnet: '',
    dj: '',
    drum: '',
    band: '',
    halloutside: '',
    limo: '',
    cert: '',  
    attr: '',
    groomSuit: '',
    groomShoe: '',
    groomJew: '',
    brideDress: '',
    brideShoe: '',
    brideJew: '',
    brideHair: '',
    brideFlower: '',
    brideMakeup:'',
    prep: '',
    Rabbi: '',
    guestGifts: '',
    ring: '',
    invite: '',
    alc: ''

  })
  $("#error-result").text("הרשמה בוצעה בהצלחה").css("display", "block");
  redirect(userId)
}

// sign up & login with phone number

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

$("#submit-phone").on('click', e => {
 
  var phoneNumber = document.getElementById('phone-ver').value;
  if(phoneNumber.length <= "9"){
    $("#error-result").text("מספר טלפון שגוי").css("display", "block");;
  }else{
    $("#error-result").css("display", "none");
    var appVerifier = window.recaptchaVerifier;
    toString(phoneNumber)
    phoneNumber = "+972" + phoneNumber.substr(1)
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
         window.confirmationResult = confirmationResult;
         $("#send-sms").css("display", "none"); $("#get-sms").css("display", "block");      
        }).catch(function (error) {
          // Error; SMS not sent
          // ...
          
          if (error.code) {
            switch (e.code) {
              case 'auth/invalid-phone-number':
                $("#error-result").text("מספר טלפון שגוי").css("display", "block");
                break;
              default:
                $("#error-result").text("קרתה שגיאה").css("display", "block");
            }
            console.log(error.code);
          }
        });
  }
 

})

$("#sub-code").on('click', e => {
  var code = document.getElementById('code').value;
  confirmationResult.confirm(code).then(function (result) {
    // User signed in successfully.
    var user = result.user;
    // ...
    var credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, code);
    let phone = user.phoneNumber
    let userName = user.name === undefined ? "" : user.name
    let userEmail = user.email === undefined ? "" : user.email
    let userPicture = user.picture === undefined ? "" : user.picture
    let FirstName = user.given_name === undefined ? "" : user.given_name
    let user_location = user.location === undefined ? "" : user.location

    
    var userId = auth.currentUser.uid;
    
        var reg = dataBase.ref("users/" + userId);
    
        reg.once('value', function (snapshot) {
          loginLoader()
          if (snapshot.val()) {
            redirect()
          } else {
            
            register(userName,userEmail,userPicture,FirstName,user_location,phone)
          }
    
        })

  }).catch(function (error) {
    // User couldn't sign in (bad verification code?)
    // ...
    if (error.code) {
            switch (error.code) {
              case 'auth/invalid-verification-code':
                $("#error-result").text("טעות בהקשת הקוד").css("display", "block");
                break;
                case 'auth/code-expired':
                $("#error-result").text("פג תוקף הקוד<span onClick='resend()'>שלח קוד חדש</span>").css("display", "block");

                break;
              default:
                $("#error-result").text("קרתה שגיאה").css("display", "block");
            }
            console.log(error.code);
          }
  });
})

// login with google
$("#google-login").one('click', function () {
  
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    
    firebase.auth().signInWithPopup(provider).then(function (result) {
  
  
      // This gives you a Google Access Token. You can use it to access the Google API.
      let token = result.credential.accessToken;
      // The signed-in user info.
      let user = result.additionalUserInfo.profile;
  
      let userName = user.name === undefined ? "" : user.name
      let userEmail = user.email === undefined ? "" : user.email
      let userPicture = user.picture === undefined ? "" : user.picture
      let FirstName = user.given_name === undefined ? "" : user.given_name
      let user_location = user.location === undefined ? "" : user.location
  
      var userId = auth.currentUser.uid;
  
      var reg = dataBase.ref("users/" + userId);
  
      reg.once('value', function (snapshot) {
        loginLoader()
        if (snapshot.val()) {
          redirect()
        } else {
          
          register(userName,userEmail,userPicture,FirstName,user_location)
        }
  
      })
    })
  })
  
  
  // login with facebook
  $("#facebook-login").on('click', function () {
  
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('public_profile');
    provider.addScope('email');
    provider.addScope('user_status');
    provider.addScope('user_location');
    provider.addScope('user_hometown');
    firebase.auth().signInWithPopup(provider).then(function (result) {
  
  
      // This gives you a Google Access Token. You can use it to access the Google API.
      let token = result.credential.accessToken;
      // The signed-in user info.
      let user = result.additionalUserInfo.profile;
      let userName = user.name === undefined ? "" : user.name
      let userEmail = user.email === undefined ? "" : user.email
      let userPicture = user.picture.data.url === undefined ? "" : user.picture.data.url
      let FirstName = user.first_name === undefined ? "" : user.first_name
      let user_location = user.location === undefined ? "" : user.location.name
      let phone = user.phone === undefined ? "" : user.phone      
      let gender = user.gender === undefined ? "" : user.gender
  
  
       console.log(result)
    //  return false;
      let userId = auth.currentUser.uid;
      let reg = dataBase.ref("users/" + userId);
      reg.once('value', function (snapshot) {
        loginLoader()
        if (snapshot.val()) {
          redirect()
        } else {
          register(userName,userEmail,userPicture,FirstName,user_location,phone,gender)
        }
  
      })
    })
  })
  
function resend(){
  $("#sub-code").trigger("click")
}


// add loader while login.
function loginLoader(){
  $("#sub-code").css("background","#e74b46d1").css("cursor","not-allowed;").off("click")
  $("#home-loader").css("display","block")
}

/*
register with email and pass
$("#validate").on('click', e => {
  let userName = ""
  email = document.getElementById('emailreg').value;
  pass = document.getElementById('passreg').value;
  console.log(email)

  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch(e => {
    if (e.code) {
      switch (e.code) {
        case 'auth/invalid-email':
          $("#error-result").text("אימייל לא תקין").css("display", "block");;
          break;
        case 'auth/weak-password':
          $("#error-result").text("סיסמה חלשה מדי").css("display", "block");;
          break;
        case 'auth/email-already-in-use':
          $("#error-result").text("אימייל כבר בשימוש").css("display", "block");;
          break;
        default:
          $("#error-result").text("קרתה שגיאה").css("display", "block");;
      }
      console.log(e.code);
    }
  });

  promise.then(function () {

    register(userName,email)
  })
});

login with user and pw
$("#email-sign").on('click', e => {

  let email = $('#emaillog').val();
  let pass = $('#passlog').val();
  const login = auth.signInWithEmailAndPassword(email, pass)


  login.catch(e => {
    if (e.code) {
      switch (e.code) {
        case 'auth/invalid-email':
          $("#error-result-login").text("אימייל לא תקין").css("display", "block");
          break;
        case 'auth/wrong-password':
          $("#error-result-login").text("סיסמה שגויה").css("display", "block");
          break;
        case 'auth/user-not-found':
          $("#error-result-login").text("משתמש לא מוכר").css("display", "block");
          break;
        default:
          $("#error-result-login").text("קרתה שגיאה").css("display", "block");
      }
      console.log(e.code);
    }
  });

  login.then(function () {
    $("#error-result-login").text("!התחברת בהצלחה").css("display", "block");
    redirect()
  })


})

*/
$(document).ready(function () {

    let user = auth.currentUser;
    let parPage = "/"
    auth.onAuthStateChanged(function (user) {
        if (user) {
            // set user data on page
            dataBase.ref('users/' + user.uid).once('value').then(function (user) {
                if (user.val().Photo == "") {
                    $("#user-image").css("background", "gray")
                } else {
                    $("#user-image").attr("src", user.val().Photo)
                }
                $("#user-head h3").text(user.val().name)
                $("#user-email").text(user.val().email)

                //bride details
                $("#bride-name").val(user.val().WifeName)
                $("#cell").val(user.val().WifePhone)
                $("#bride-town").val(user.val().WifeArea)
                $("#bride-facebook").val(user.val().WifeFaceBook)

                //groom details
                $("#groom-name").val(user.val().HusbandName)
                $("#cell-gr").val(user.val().HusbandPhone)
                $("#groom-town").val(user.val().HusbandArea)
                $("#groom-facebook").val(user.val().HusbandFaceBook)
                
                $("#date").val(user.val().Date)
                $("#invites").val(user.val().Guest)
                $("#home-loader").css("display", "none")
            })

            // upload new image
            let fileBtn = document.getElementById("imgupload")
            fileBtn.addEventListener("change", function (e) {
                let file = e.target.files[0]
                let storeageRef = fireStorage.ref('users-image/' + user.uid + '/' + file.name)
                let task = storeageRef.put(file)
                task.on('state_changed',
                    function prograss(snap) {
                        $(".spin-par").css("display", "block")
                        let precetage = (snap.bytesTransferred / snap.totalBytes) * 100
                        console.log(precetage)
                    },
                    function err(err) {
                        console.log(err)
                    },
                    function complete() {
                        dataBase.ref('users/' + user.uid + '/Photo').set(task.metadata_.downloadURLs[0]).then(function (snap) {
                            dataBase.ref('users/' + user.uid).once('value').then(function (user) {
                                $("#user-image").attr("src", task.metadata_.downloadURLs[0])
                            })
                        })
                        $(".spin-par").css("display", "none")
                    }
                )
            })
        } else {
            window.location.href = parPage;
        }
    });
    $(".fa-camera").click(function () {
        $('#imgupload').trigger('click');
    });


});


// update data
function updateUser(){
    let user = auth.currentUser;
    auth.onAuthStateChanged(function (user) {
    dataBase.ref('users/' + user.uid).once('value').then(function (data) {
        let updateUser = data.val();

        updateUser.WifeName =  $("#bride-name").val()
        updateUser.WifePhone =  $("#cell").val()
        updateUser.WifeArea =  $("#bride-town").val()
        updateUser.WifeFaceBook =  $("#bride-facebook").val()

        updateUser.HusbandName =  $("#groom-name").val()
        updateUser.HusbandPhone =  $("#cell-gr").val()
        updateUser.HusbandArea =  $("#groom-town").val()
        updateUser.HusbandFaceBook =  $("#groom-facebook").val()

        updateUser.Date =  $("#date").val();
        updateUser.Guest =  $("#invites").val();
        //console.log(updateUser)
        dataBase.ref('users/' + user.uid).set(updateUser).then(function (snap) {
            alert("הנתונים עודכנו")
            })
    })
})
}

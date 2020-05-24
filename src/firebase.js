// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA-P3f0nfKrnrGaauncFNZYacp-47yplvg",
  authDomain: "product-3dac7.firebaseapp.com",
  databaseURL: "https://product-3dac7.firebaseio.com",
  projectId: "product-3dac7",
  storageBucket: "product-3dac7.appspot.com",
  messagingSenderId: "814021280593",
  appId: "1:814021280593:web:521eef889cd09cbc0a8970",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// 클라우드 파이어스토어
var db = firebase.firestore();

/** 
  공식메뉴얼
  https://firebase.google.com/docs/firestore/quickstart?hl=ko
  // 데이터 정렬 및 제한
  https://firebase.google.com/docs/firestore/query-data/order-limit-data?hl=ko
**/

// 여기에 DB 컬랙션 이름을 작성
var collection_name = "posts";
var limit = 10,
  docs_length = 0; // 문서수

// read
db.collection(collection_name)
  .orderBy("date", "desc") // 내림차순
  .limit(99) // 불러올 글 수
  .get()
  .then((myData) => {
    var html = `
        <table class="table">
          <tr>
            <th class="num">번호</th>
            <th class="title">글제목</th>
            <th class="date">작성일</th>
            <th>&nbsp;</th>
            <!-- <th class="id">id</th> -->
          </tr>
    `;
    console.log(myData.docs.length);
    docs_length = myData.docs.length;

    myData.forEach((doc) => {
      // collection.docment.field
      var id = doc.id;
      var title = doc.data().title;
      var desc = doc.data().desc;
      var date = doc.data().date;
      console.log(title, desc, date);
      html += `
        <tr>
          <td class="num">${docs_length--}</td>
          <td class="title"><a href='#'>${title}</a></td>
          <td class="date">${date.slice(0,12)}</td>
          <!-- <td class="id">${doc.id}</td> -->
          <td>
            <a href="#" class="btn_del" data-id=${doc.id}>삭제</a> | 
            <a href="#update" class="btn_update" data-id=${doc.id}>수정</a>
          </td>
        </tr>
      `;
    });
    html += `</table>`;
    $("#post_list").append(html);
  });

// 추가(id 자동 생성)
function add_db(data) {
  db.collection(collection_name)
    .add(data)
    .then(function (docRef) {
      console.log("다음의 ID로 데이터 추가됨 ", docRef.id);
      document.getElementById("info_text").innerHTML = "쓰기 완료!";
      setTimeout(function () {
        document.getElementById("info_text").innerHTML = "";
        location.reload();
      }, 3000);
    })
    .catch(function (error) {
      console.error("쓰기 오류 ", error);
    });
}


// 수정 - post_view(글보기) 수정 버튼
$("#post_view .btn_update").on("click", function (e) {
  // e.preventDefault();
  var _id = $(this).attr('data-id'); 
  
  // read document
  db.collection(collection_name)
    .doc(_id)
    .get()
    .then(function (myData) {
      $('#update_title').val(myData.data().title);
      $('#update_desc').val(myData.data().desc); 
      $('#update_title .btn_send').attr('data-id', _id);

      // 수정
      $('#update').on('submit', function(){
        // 글 수정하기 폼의 내용을 가져와 update
        var title = $(this).find('#update_title').val();
        var desc = $(this).find('#update_desc').val();
        var obj = {
          title: title,
          desc: desc,
          date: new Date().toLocaleString()
        };

        db.collection(collection_name)
        .doc(_id)
        .update(obj)
        .then(function(){ 
          console.log('업데이트 완료');
          location.reload();
        }) 
        .catch(function(error){ console.log('업데이트 오류!')})       
      })
    })
    .catch(function (error) {
      console.error("오류 ", error);
    });
});

// 수정 - post list 버튼
$("#post_list").on("click", ".btn_update", function (e) {
  var _id = $(e.target).attr('data-id');  // document key or name(id)
  
  // read document
  db.collection(collection_name)
    .doc(_id)
    .get()
    .then(function (myData) {
      $('#update_title').val(myData.data().title);
      $('#update_desc').val(myData.data().desc); 
      $('#update_title .btn_send').attr('data-id', _id);

      // 수정
      $('#update').on('submit', function(){
        // 글 수정하기 폼의 내용을 가져와 update
        var title = $(this).find('#update_title').val();
        var desc = $(this).find('#update_desc').val();
        var obj = {
          title: title,
          desc: desc,
          date: new Date().toLocaleString()
        };

        db.collection(collection_name)
        .doc(_id)
        .update(obj)
        .then(function(){ 
          console.log('업데이트 완료');
          location.reload();
        }) 
        .catch(function(error){ console.log('업데이트 오류!')})       
      })
    })
    .catch(function (error) {
      console.error("오류 ", error);
    });
});

// 삭제(post-list 버튼)
$("#post_list").on("click", ".btn_del", function (e) {
  var ans = confirm('정말로 삭제하시겠습니까?');
  if(!ans) return;
  
  console.log("삭제", $(e.target).attr('data-id'));
  var _id = $(e.target).attr('data-id');  // document key or name(id)

  db.collection(collection_name)
    .doc(_id)
    .delete()
    .then(function () {
      console.log("다음의 ID의 데이터 제거됨 ");
      location.reload();
    })
    .catch(function (error) {
      console.error("오류 ", error);
    });
});

// 삭제 - post_view 버튼
$("#post_view .btn_delete").on("click", function (e) {
  e.preventDefault();
  var ans = confirm('정말로 삭제하시겠습니까?');
  if(!ans) return;
  
  console.log("삭제", $(this).attr('data-id'));
  var _id = $(this).attr('data-id');

  db.collection(collection_name)
    .doc(_id)
    .delete()
    .then(function () {
      console.log("다음의 ID의 데이터 제거됨 ");
      location.reload();
    })
    .catch(function (error) {
      console.error("오류 ", error);
    });
});

// 추가 버튼
$("#post").on("submit", function (e) {
  e.preventDefault();
  var title = $("#post_title").val();
  var desc = $("#post_desc").val();
  var obj = {
    title: title,
    desc: desc,
    date: new Date().toLocaleString(),
  };
  add_db(obj);
  console.log(obj);
});

// 글보기
$("#post_list").on("click", ".title a", function (e) {
  e.preventDefault();
  // read document id
  var _id = $(e.target)
              .parents('tr')
              .find('.btn_update')
              .attr('data-id');

  db.collection(collection_name)
    .doc(_id)
    .get()
    .then(function (myData) {
      $('#post_view > h1').text(myData.data().title);
      $('#post_view > p').text(myData.data().desc); 
      $('#post_view').find('.btn_update, .btn_delete')
        .attr('data-id', _id); 

    })
    .catch(function (error) {
      console.error("오류 ", error);
    });  
});
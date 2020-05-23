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
          <td class="title">${title}</td>
          <td class="date">${date.slice(0,12)}</td>
          <!-- <td class="id">${doc.id}</td> -->
          <td>
            <button id="btn_del" data-id=${doc.id}>삭제</button>
            <button id="btn_update" data-id=${doc.id}>수정</button>
          </td>
        </tr>
      `;
    });
    html += `</table>`;
    $("#view").append(html);
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

// 수정
$("#view").on("click", "#btn_update", function (e) {
  var _id = $(e.target).attr('data-id');  // document key or name(id)
  
  db.collection(collection_name)
    .doc(_id)
    .get()
    .then(function (myData) {
      console.log(myData.data().title);
      console.log(myData.data().desc);
      $('#title').val(myData.data().title);
      $('#desc').val(myData.data().desc); 
    })
    .catch(function (error) {
      console.error("오류 ", error);
    });
});

// 삭제
$("#view").on("click", "#btn_del", function (e) {
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

// 추가 버튼
$("#post").on("submit", function (e) {
  e.preventDefault();
  var title = $("#title").val();
  var desc = $("#desc").val();
  var obj = {
    title: title,
    desc: desc,
    date: new Date().toLocaleString(),
  };
  add_db(obj);
  console.log(obj);
});

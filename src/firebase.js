// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA-P3f0nfKrnrGaauncFNZYacp-47yplvg",
  authDomain: "product-3dac7.firebaseapp.com",
  databaseURL: "https://product-3dac7.firebaseio.com",
  projectId: "product-3dac7",
  storageBucket: "product-3dac7.appspot.com",
  messagingSenderId: "814021280593",
  appId: "1:814021280593:web:521eef889cd09cbc0a8970"
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
var collection_name = 'posts';
var limit = 10, doc_length = 0;

// read
db.collection(collection_name)
  .orderBy('date', 'desc') // 내림차순
  .get()
  .then((querySnapshot) => {
    var html = `
        <ul class="list-group">
          <li class="list-group-item">
            <span class="num">번호</span>
            <span class="title">글제목</span>
            <span class="date">작성일</span>
            <span class="id">id</span>
          </li>
    `;
    var i = 0;
    querySnapshot.forEach((doc) => {
      // collection.docment.field
      var id = doc.id;
      var title = doc.data().title;
      var desc = doc.data().description;
      var date = doc.data().date;
      console.log(title, desc, date)
      html += `
        <li class="list-group-item" id="${doc.id}">
          <span class="num">${i++}</span>
          <span class="title">${title}</span>
          <span class="date">${date}</span>
          <span class="id">${doc.id}</span>
        </li>
      `
    });
    html += `</ul>`
    $('#view').append(html);
  });

// 추가(id 자동 생성)
function add_db(data) {
  db.collection(collection_name).add(data)
  .then(function(docRef) {
    console.log("다음의 ID로 데이터 추가됨 ", docRef.id);
    document.getElementById('info_text').innerHTML = '쓰기 완료!';
    setTimeout(function(){
      document.getElementById('info_text').innerHTML = '';
    }, 3000)
  })
  .catch(function(error) {
    console.error("쓰기 오류 ", error);
  });
}

$('#post').on('submit', function(e){
  e.preventDefault();
  var title = $('#title').val();
  var desc = $('#desc').val();
  var obj = {
    title: title,
    desc: desc,
    date: new Date().toLocaleString()
  }
  add_db(obj);
  console.log(obj)
})

// 추가(id 자동 생성)
// firebase
//   .database()
//   .ref("info")
//   .push({
//     album: "bbb",
//     year: new Date().toLocaleString()
//   });

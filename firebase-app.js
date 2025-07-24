
<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, query, where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAYmv1mt2QV0Ex0J1PlASfZjA3bdBvIJws",
  authDomain: "haishang-a09c3.firebaseapp.com",
  projectId: "haishang-a09c3",
  storageBucket: "haishang-a09c3.firebasestorage.app",
  messagingSenderId: "457535470987",
  appId: "1:457535470987:web:c94320eb296696e132838e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.db = db; // expose for global usage
window.firestore = { collection, addDoc, getDocs, query, where };
</script>

const $ = id => document.getElementById(id);

window.parseAndUpload = async () => {
  const vendor = $('vendor').value.trim();
  const date = $('date').value;
  const raw = $('rawText').value.trim();
  const lines = raw.split('\n');

  for (let line of lines) {
    const match = line.match(/(\d{2,3}\/\d{2,3}|BKN)\s*[\$＄]?\s*(\d+)/);
    if (match) {
      const spec = match[1];
      const price = parseInt(match[2]);
      await firestore.addDoc(firestore.collection(db, 'items'), {
        品名: '白蝦仁',
        規格: spec,
        價格: price,
        廠商: vendor,
        日期: date,
        時間戳: new Date()
      });
    }
  }
  alert("已上傳至雲端！");
};

window.cloudQuery = async () => {
  const input = $('queryInput').value.trim();
  const keywords = input.split(/\s+/);
  const snapshot = await firestore.getDocs(firestore.collection(db, 'items'));
  const table = $('queryResult');
  table.innerHTML = "<tr><th>品名</th><th>規格</th><th>價格</th><th>廠商</th><th>日期</th></tr>";

  const all = [];
  snapshot.forEach(doc => all.push(doc.data()));
  const filtered = all.filter(d => keywords.every(k => d.品名.includes(k) || d.規格.includes(k)));
  filtered.sort((a, b) => a.價格 - b.價格);

  filtered.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${d.品名}</td><td>${d.規格}</td><td>${d.價格}</td><td>${d.廠商}</td><td>${d.日期}</td>`;
    table.appendChild(tr);
  });
};

window.uploadBulk = async () => {
  const vendor = $('bulk_vendor').value.trim();
  const date = $('bulk_date').value;
  const name = $('bulk_name').value.trim();
  const content = $('bulkText').value.trim();
  await firestore.addDoc(firestore.collection(db, 'bulk'), {
    品名: name,
    廠商: vendor,
    日期: date,
    內容: content,
    時間戳: new Date()
  });
  alert("自由報價已上傳！");
};

window.queryBulk = async () => {
  const keyword = $('bulkQueryInput').value.trim();
  const snapshot = await firestore.getDocs(firestore.collection(db, 'bulk'));
  const div = $('bulkQueryResult');
  div.innerHTML = "";

  snapshot.forEach(doc => {
    const d = doc.data();
    if (d.品名.includes(keyword)) {
      const box = document.createElement("div");
      box.style.border = "1px solid #ccc";
      box.style.margin = "10px 0";
      box.style.padding = "10px";
      box.innerHTML = `<b>${d.品名}</b>（${d.廠商} / ${d.日期}）<br/><pre>${d.內容}</pre>`;
      div.appendChild(box);
    }
  });
};

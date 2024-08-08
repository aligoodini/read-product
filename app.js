const excel_file = document.getElementById("excel_file");
const searchName = document.querySelector(".search-name");
const searchBarcode = document.querySelector(".search-barcode");
const table = document.querySelector(".table");
let filteredNames = [];
let searchedBarcode = "";

excel_file.addEventListener("change", (event) => {
  // ------------------------------------------------------------ convert to array
  var reader = new FileReader();

  reader.readAsArrayBuffer(event.target.files[0]);

  reader.onload = async function (event) {
    var data = new Uint8Array(reader.result);

    var work_book = XLSX.read(data, { type: "array" });

    var sheet_name = work_book.SheetNames;

    var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], {
      header: 1,
    });

    // ------------------------------------------------------- send data to json server

    // const postData = await fetch(`http://localhost:3000/products`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(sheet_data),
    // });
    // const resPostData = await postData.json();

    localStorage.setItem("afsharData", JSON.stringify(sheet_data));

    getData();

    excel_file.value = "";
  };
});

// --------------------------------------------------- get data from json server

window.addEventListener("load", () => {
  getData();
});

function getData() {
  const LocalData = JSON.parse(localStorage.getItem("afsharData"));
  filteredNames = [...LocalData];
  console.log(filteredNames);
  makeTable(filteredNames);

  // fetch(`http://localhost:3000/products`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     console.log(data);
  //     console.log(data.length);
  //     if (data.length) {
  //       filteredNames = [...Object.values(data[0])];

  //       console.log(filteredNames);

  //     }
  //   });
}

function onScanSuccess(decodedText, decodedResult) {
  // console.log(`Code scanned = ${decodedText}`, decodedResult);
  console.log(decodedText);
  filterBarcode(decodedText);
  
}
var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {
  fps: 500,
  qrbox: 250,
});
html5QrcodeScanner.render(onScanSuccess);

// ------------------------------------------------------------- filter by name
searchName.addEventListener("keyup", (e) => {
  searchBarcode.value = "";
  table.innerHTML = "";

  let searchedName = e.target.value;
  let myItems = filteredNames.filter((item) => {
    if (item[1]) {
      return item[1].toLowerCase().includes(searchedName.toLowerCase());
    }
  });

  console.log(myItems);

  makeTable(myItems);
});

// ------------------------------------------------------------- filter by barcode
searchBarcode.addEventListener("keyup", (e) => {
  searchName.value = "";

  searchedBarcode = e.target.value;
  filterBarcode(searchedBarcode);
});

function filterBarcode(searchedBarcode) {
  table.innerHTML = "";
  let myItems = filteredNames.filter((item) => {
    if (item[0]) {
      let changeItem = item[0].toString();
      return changeItem.includes(searchedBarcode);
    }
  });

  makeTable(myItems);
}
// -------------------------------------------------------------- make table

function makeTable(arraItem) {
  arraItem.map((item, index) => {
    const tr = document.createElement("tr");
    const td0 = document.createElement("td");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td0.innerHTML = `${index + 1}`;
    td1.innerHTML = `${item[0]}`;
    td2.innerHTML = `${item[1]}`;
    td3.innerHTML = `${item[2]}`;
    td4.innerHTML = `${item[3]}`;

    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    table.appendChild(tr);
  });
}

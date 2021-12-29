const ul1= document.querySelector("#tableNumber");
const modalPopup= document.querySelector(".popup");

var tables=[{'totalCost':0,'items':[],'quantity':[]},
{'totalCost':0,'items':[],'quantity':[]},
{'totalCost':0,'items':[],'quantity':[]}];

var menu =[{'name':'Dosa','price':99,'category':'tiffin'},
{'name':'Idly','price':45,'category':'tiffin'} ,
{'name':'Paneer Tikka','price':199,'category':'starter'},
{'name':'Veg Manchurian','price':199,'category':'starter'},
{'name':'Chicken Biryani','price':249,'category':'main course'},
{'name':'Veg Pulao','price':199,'category':'main course'},
{'name':'Gulab Jamun','price':65,'category':'dessert'},
{'name':'Halwa','price':99,'category':'dessert'},
{'name':'Lassi','price':99,'category':'beverage'},
{'name':'Masala Chai','price':49,'category':'beverage'},
];

for(let i=0;i<3; i++){ 
    var row= `<li class="list-group-item tableNo" >
        <a data-bs-toggle="modal" id="${i+1}" data-bs-target="#exampleModal${i+1}" 
        onclick=load(${i+1})>Table ${i+1}
            </a>
            <br>
            ₹ <span class="amount"> 0 </span>
        <span> | Total items </span> <span class="noOfItems"> 0</span>
        </li>`
    ul1.innerHTML+=row;

    var popUp=`<div class="modal fade" id="exampleModal${i+1}" tabindex="-1" 
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Table-${i+1} | Order Details</h5>
        <button type="button" class="btn-close btn-close-white" onclick=exit(${i+1})
        data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        <table class="table" id="modal${i+1}">
        <tr>
            <th>S.No</th>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
        </tr>
        </table>
    <p id="totalAmount${i+1}"></p>
    </div>
    <div class="modal-footer">
        <p><a id="closemodal" data-bs-dismiss="modal" onclick=closeSession(${i+1})> 
        Close Session Generate bill </a> </p> 
    </div>
    </div>
    </div>
    </div>`
    modalPopup.innerHTML+=popUp;
}

function searchTable(){
    let filter=document.getElementById("search_table").value.toLowerCase();
    let list=document.getElementById("tableNumber");
    let li=list.getElementsByTagName("li");
    for(let i=0;i<li.length; i++){
        let textvalue= li[i].textContent.toLowerCase();
        if(textvalue.indexOf(filter)> -1){
            li[i].style.display="";
        }
        else{
            li[i].style.display="none";
        }
    }
}

function searchMenu(){
    let filter=document.getElementById("search_menu").value.toLowerCase();
    let list=document.getElementById("itemList");
    let li=list.getElementsByTagName("li");
    for(let i=0;i<li.length; i++){
        let textvalue= li[i].textContent.toLowerCase();
        let index= li[i].id;
        let type= `${menu[index].category}`;
        if(textvalue.indexOf(filter)> -1 || type.indexOf(filter)> -1){
            li[i].style.display="";
        }
        else{
            li[i].style.display="none";
        }
    }
}

const ul= document.querySelector("#itemList");


for(let i=0;i<menu.length; i++){
    var listItem=`<li class="list-group-item items" draggable="true" id=${i} > ${menu[i].name} <br>
     <span> ${menu[i].price} </span>
     <p hidden id=" ${menu[i].category}" </li> `
    ul.innerHTML +=listItem;
}

var menuList= document.querySelectorAll(".items");
for(let j=0;j<menuList.length; j++){
    var element= menuList[j];
    element.addEventListener('dragstart', function(event) {
    event.dataTransfer.effectAllowed = 'copy';
    var ind= parseInt(this.id);
    event.dataTransfer.setData('text', ind);
    return false;  
}, false);
}

var listElements= document.querySelectorAll(".tableNo");

for(var i=0;i<listElements.length;i++){
var takeOrder = listElements[i];
takeOrder.addEventListener('dragover', function(event) {
    if (event.preventDefault) event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    return false;   
}, false);

takeOrder.addEventListener('dragenter', function(event) {
    return false;   
}, false);

takeOrder.addEventListener('dragleave', function(event) {
    return false;
}, false);

takeOrder.addEventListener('drop', function(event) {
if (event.stopPropagation) event.stopPropagation();
var index =parseInt(event.dataTransfer.getData('text'));       
let tbno= parseInt(this.getElementsByTagName('a')[0].id);
//console.log(tbno);
if(tables[tbno-1].items.includes(menu[index].name)){
    alert("Item already present!");
    return false;
}
tables[tbno-1].items.push(menu[index].name);
tables[tbno-1].totalCost+=menu[index].price;
tables[tbno-1].quantity.push(1);
setBill(tbno);
return false;
}, false);
}
var sno=0;

function setBill(id){
var amount=listElements[id-1].querySelector(".amount");
amount.textContent=tables[id-1].totalCost;
var noOfItems=listElements[id-1].querySelector(".noOfItems");
let count=0;
for(ele of tables[id-1].quantity)
    count+=parseInt(ele);
noOfItems.textContent=count;
let p = document.querySelector(`#totalAmount${id}`);
p.textContent=`Total: ${tables[id-1].totalCost}`;
}

function load(id){
var table=listElements[id-1];
table.style.backgroundColor="orange";
var modal=document.querySelector(`#modal${id}`);
var rows=modal.getElementsByClassName("rowModal");
while(rows.length > 0){
    rows[0].parentNode.removeChild(rows[0]);
}
let arrLength=tables[id-1].items.length;
let arr=tables[id-1].items;
let size=tables[id-1].quantity;
for(let i=0;i<arrLength; i++){
let price=getPrice( arr[i]);
let element=`<tr class="rowModal" id="rowNo${i}"">
            <td>${i+1}</td>
            <td>${arr[i]}</td>
            <td>${price}</td>
            <td> <input type="number" id="quantity${i}" min=1 value="${size[i]}" 
                onchange=updateQuantity(${id},${i}) name="quantity"></td>
            <td onclick=removeItem(${id},${i})><i class="bi bi-trash-fill"></i><td>
            </tr>`
modal.innerHTML+=element;
}

setBill(id);
}

function updateQuantity(id, i){
var modal=document.querySelector(`#modal${id}`);
var table=listElements[id-1];
let quant=modal.querySelector(`#quantity${i}`).value;
tables[id-1].quantity[i]=quant;

let bill=0;
let count=0;
let arrLength=tables[id-1].items.length;
for(let j=0;j<arrLength;j++){
    let price=parseInt(getPrice( tables[id-1].items[j]));
    count=count+parseInt(tables[id-1].quantity[j]);
    bill=bill+(parseInt(tables[id-1].quantity[j])*price);
}
tables[id-1].totalCost=bill;
setBill(id);
}

function getPrice(str){
let price=0;
for(ele of menu){
    if(ele.name===str)
        price= ele.price;
}
return price;
}

function removeItem(id,ele){
let price=getPrice(tables[id-1].items[ele])*tables[id-1].quantity[ele];
tables[id-1].items.splice(ele,1);
tables[id-1].quantity.splice(ele,1);
tables[id-1].totalCost=tables[id-1].totalCost-price;
let modal=document.querySelector(`#modal${id}`);
let row=modal.querySelector(`#rowNo${ele}`);
row.parentNode.removeChild(row);
//console.log(tables[id-1]);
load(id);
setBill(id);
}

function closeSession(id){
let arrLength=tables[id-1].items.length;
alert(`Thank you for ordering. Your Bill amount is ${tables[id-1].totalCost}`)
tables[id-1].totalCost=0;
tables[id-1].items.splice(0,arrLength);
tables[id-1].quantity.splice(0,arrLength);
load(id); 
exit(id);  
}

function exit(id){
var table=listElements[id-1];
table.style.backgroundColor="";
}
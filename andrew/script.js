const viewDrawings = document.getElementById("viewDrawings"); 

let supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
let supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'

var drawData = [];
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
getDrawings();
//simple fetch function from supabase for testing
async function getDrawings() {

  const { data, error } = await supabase
    .from("drawings")
    .select("*");
  if (error){
     console.error("Error inserting customer:", error);
  }
  else {
    console.log("Customer added:", data);
    drawData = data;
  }
  makeTheDrawings();
} 

function makeTheDrawings(){
const drawArea = document.getElementById('viewDrawings')
//add broader to drawings
// show drawing makers name
  //loop over eacg element in the array
  for(var i=0; i<drawData.length;i++){
    //create a canvas area and name it
    const canvas = document.createElement('canvas')
    canvas.classList.add('drawing-canvas')  
    drawArea.append(canvas);
    load(drawData[i].data, canvas, canvas.getContext('2d'))
  }
}





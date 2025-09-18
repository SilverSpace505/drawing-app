const viewDrawings = document.getElementById("viewDrawings"); 

let supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
let supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = supabase.createClient(supabaseUrl, supabaseKey);

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
getDrawings();
//simple fetch function from supabase for testing
async function getDrawings() {

  const { data, error } = await supabase
    .from("getDrawings")
    .select("*");
  if (error){
     console.error("Error inserting customer:", error);
  }
  else {
    console.log("Customer added:", data);
  }
}
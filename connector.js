import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Setup clients
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const FIGMA_TOKEN = process.env.VITE_FIGMA_TOKEN;

async function syncFigmaData() {
  console.log("Fetching data from Figma...");
  
  // 1. Fetch files from Figma
  const response = await fetch('https://api.figma.com/v1/me/files', {
    headers: { 'X-Figma-Token': FIGMA_TOKEN }
  });
  const { files } = await response.json();

  // 2. Aggregate activity by date (Simple example: count files updated per day)
  const activityMap = {};
  files.forEach(file => {
    const date = new Date(file.last_modified).toISOString().split('T')[0];
    activityMap[date] = (activityMap[date] || 0) + 1;
  });

  // 3. Push to Supabase
  for (const [date, count] of Object.entries(activityMap)) {
    const { error } = await supabase
      .from('figma_activity')
      .upsert({ activity_date: date, commit_count: count }, { onConflict: 'activity_date' });
      
    if (error) console.error(`Error updating ${date}:`, error);
    else console.log(`Synced ${date}: ${count} activity`);
  }
}

syncFigmaData();
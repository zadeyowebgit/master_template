import fs from 'node:fs';

const lines = Array.from({ length: 120 }, (_, i) => {
  const rating = (i % 5) + 1;
  return `  ['@placeholder_user_${String(i + 1).padStart(3, '0')}', ${rating}, '[[REVIEW_${String(i + 1).padStart(3, '0')}_BODY — verified review text supplied during migration.]]'],`;
});

const out = `// AUTO-GENERATED — replace [[REVIEW_n_BODY]] during migration (${lines.length} reviews).\nexport interface CustomerReview { id:number; username:string; rating:number; body:string }\ntype T=[string,number,string];\nconst reviews:T[]=[\n${lines.join('\n')}\n];\nexport const customerReviews:CustomerReview[]=reviews.map(([username,rating,body],index)=>({id:index+1,username,rating,body}));\nexport const REVIEWS_VERIFIED_ON='[[REVIEWS_VERIFIED_DATE]]';\n`;
fs.writeFileSync('src/data/reviews.ts', out);
console.log('reviews.ts regenerated');

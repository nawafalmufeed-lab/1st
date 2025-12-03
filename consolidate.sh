#!/bin/bash
OUTPUT="/home/user/1st/ALL_CODE.txt"
echo "===========================================
PAYOUT MANAGEMENT SYSTEM - ALL SOURCE CODE  
===========================================
Generated: $(date)
===========================================
" > "$OUTPUT"

cd /home/user/1st/payout-system

# Add all source files
for file in src/types/index.ts src/data/mockData.ts src/context/AuthContext.tsx src/context/LanguageContext.tsx src/context/TransactionContext.tsx src/components/Layout.tsx src/pages/Login.tsx src/pages/Dashboard.tsx src/pages/TransactionsList.tsx src/pages/TransactionDetail.tsx src/pages/ReviewPage.tsx src/pages/ApprovalPage.tsx src/App.tsx src/main.tsx src/index.css src/App.css; do
  if [ -f "$file" ]; then
    echo "" >> "$OUTPUT"
    echo "========================================" >> "$OUTPUT"
    echo "FILE: $file" >> "$OUTPUT"
    echo "========================================" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
  fi
done

# Add config files
for file in tailwind.config.js postcss.config.js vite.config.ts tsconfig.json package.json index.html; do
  if [ -f "$file" ]; then
    echo "" >> "$OUTPUT"
    echo "========================================" >> "$OUTPUT"
    echo "FILE: $file" >> "$OUTPUT"
    echo "========================================" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
  fi
done

echo "" >> "$OUTPUT"
echo "========================================" >> "$OUTPUT"
echo "END - Total Lines: $(wc -l < "$OUTPUT")" >> "$OUTPUT"
echo "========================================" >> "$OUTPUT"

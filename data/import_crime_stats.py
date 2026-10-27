"""
SAPS Crime Statistics Importer
ISJ107V - Integrated Software Project 2026

Imports South Africa crime statistics from Kaggle CSV into PostgreSQL.
Dataset: SouthAfricaCrimeStats_v2.csv
Source: https://www.kaggle.com/datasets/slwessels/crime-statistics-for-south-africa

Run this script once to populate the crime_stats table.
"""

import psycopg2
import csv
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432"),
    "dbname": os.getenv("DB_NAME", "child_tracking_db"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "postgres29")
}

CSV_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "SouthAfricaCrimeStats_v2.csv")

# Crime categories relevant to missing children
RELEVANT_CATEGORIES = [
    "Kidnapping",
    "Missing persons",
    "Child abuse",
    "Abduction",
    "Sexual offences",
]

CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS crime_stats (
    id SERIAL PRIMARY KEY,
    province VARCHAR(100) NOT NULL,
    station VARCHAR(200),
    category VARCHAR(200) NOT NULL,
    year INTEGER NOT NULL,
    quarter VARCHAR(10),
    count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

CREATE_INDEX_SQL = """
CREATE INDEX IF NOT EXISTS idx_crime_stats_province ON crime_stats(province);
CREATE INDEX IF NOT EXISTS idx_crime_stats_category ON crime_stats(category);
CREATE INDEX IF NOT EXISTS idx_crime_stats_year ON crime_stats(year);
"""

INSERT_SQL = """
INSERT INTO crime_stats (province, station, category, year, quarter, count)
VALUES (%s, %s, %s, %s, %s, %s)
ON CONFLICT DO NOTHING;
"""


def connect():
    return psycopg2.connect(**DB_CONFIG)


def setup_table(conn):
    cursor = conn.cursor()
    cursor.execute(CREATE_TABLE_SQL)
    cursor.execute(CREATE_INDEX_SQL)
    conn.commit()
    cursor.close()
    print("crime_stats table created/verified.")


def detect_year_columns(headers):
    """Find columns that look like years (e.g. 2005-2006, 2006-2007)."""
    year_cols = {}
    for i, h in enumerate(headers):
        h = h.strip()
        # Match patterns like "2005-2006" or "2005/2006"
        if len(h) >= 7 and (h[4] == '-' or h[4] == '/'):
            try:
                year = int(h[:4])
                year_cols[i] = year
            except ValueError:
                pass
    return year_cols


def import_csv(conn):
    if not os.path.exists(CSV_FILE):
        print(f"ERROR: CSV file not found at {CSV_FILE}")
        print("Please download SouthAfricaCrimeStats_v2.csv from Kaggle and place it in the data/ folder.")
        return 0

    cursor = conn.cursor()
    inserted = 0
    skipped = 0

    with open(CSV_FILE, encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        headers = next(reader)

        # Detect column positions
        province_col = next((i for i, h in enumerate(headers) if 'province' in h.lower()), None)
        station_col = next((i for i, h in enumerate(headers) if 'station' in h.lower()), None)
        category_col = next((i for i, h in enumerate(headers) if 'category' in h.lower() or 'crime' in h.lower()), None)
        year_cols = detect_year_columns(headers)

        print(f"Columns detected: province={province_col}, station={station_col}, category={category_col}")
        print(f"Year columns found: {len(year_cols)}")

        if category_col is None:
            print("ERROR: Could not find category column. Check CSV format.")
            return 0

        for row in reader:
            if len(row) < 3:
                continue

            category = row[category_col].strip() if category_col < len(row) else ""

            # Only import relevant crime categories
            is_relevant = any(
                rel.lower() in category.lower()
                for rel in RELEVANT_CATEGORIES
            )
            if not is_relevant:
                skipped += 1
                continue

            province = row[province_col].strip() if province_col is not None and province_col < len(row) else "Unknown"
            station = row[station_col].strip() if station_col is not None and station_col < len(row) else None

            # Insert one row per year column
            for col_idx, year in year_cols.items():
                if col_idx < len(row):
                    value_str = row[col_idx].strip().replace(',', '')
                    try:
                        count = int(float(value_str)) if value_str else 0
                    except (ValueError, TypeError):
                        count = 0

                    if count > 0:
                        cursor.execute(INSERT_SQL, (province, station, category, year, None, count))
                        inserted += 1

    conn.commit()
    cursor.close()
    return inserted


def print_summary(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT category, SUM(count) as total FROM crime_stats GROUP BY category ORDER BY total DESC")
    rows = cursor.fetchall()
    print("\nImported crime statistics summary:")
    print(f"{'Category':<40} {'Total':>10}")
    print("-" * 52)
    for row in rows:
        print(f"{row[0]:<40} {row[1]:>10,}")

    cursor.execute("SELECT province, SUM(count) as total FROM crime_stats WHERE category ILIKE '%kidnap%' GROUP BY province ORDER BY total DESC")
    rows = cursor.fetchall()
    print("\nKidnapping statistics by province:")
    print(f"{'Province':<40} {'Total':>10}")
    print("-" * 52)
    for row in rows:
        print(f"{row[0]:<40} {row[1]:>10,}")
    cursor.close()


def main():
    print("=" * 60)
    print("SAPS Crime Statistics Importer")
    print("=" * 60)

    conn = connect()
    print("Connected to database.")

    setup_table(conn)

    print(f"\nImporting from: {CSV_FILE}")
    inserted = import_csv(conn)

    if inserted > 0:
        print(f"\nInserted {inserted:,} records.")
        print_summary(conn)
    else:
        print("No records inserted.")

    conn.close()
    print("\nDone.")


if __name__ == "__main__":
    main()
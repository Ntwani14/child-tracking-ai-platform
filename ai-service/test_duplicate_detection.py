from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

THRESHOLD = 0.25

existing_reports = [
    {"id": "R001", "text": "Lebo Dlamini female 8 short dark skin red dress Soshanguve Block H near school"},
    {"id": "R002", "text": "Thabo Nkosi male 12 blue jeans white shirt Mamelodi East shopping centre"},
    {"id": "R003", "text": "Zintle Mabaso female 6 yellow dress birthmark left cheek Katlehong Primary"},
    {"id": "R004", "text": "Sipho Khumalo male 14 grey tracksuit orange stripes shaved head Soweto Dobsonville"},
    {"id": "R005", "text": "Amahle Zulu female 9 pink top black leggings long braids Durban North Umgeni Road"},
    {"id": "R006", "text": "Kagiso Sithole male 11 gap tooth grey pants white shirt Tembisa near hospital"},
    {"id": "R007", "text": "Nomvula Dube female 7 blue white school dress scar right eyebrow Alexandra Township"},
    {"id": "R008", "text": "Rethabile Mokoena female 13 red sneakers black hoodie natural hair Bloemfontein Mangaung"},
    {"id": "R009", "text": "Tshepo Molefe male 10 maroon jersey glasses blue school bag Pretoria West station"},
    {"id": "R010", "text": "Ayanda Ntuli female 5 pink dress white spots birthmark neck Pietermaritzburg Edendale"},
]

duplicate_tests = [
    {"new": "Lebo Dlamini girl 8 years dark complexion wearing red dress last seen Soshanguve Block H", "expected": "R001"},
    {"new": "Thabo Nkosi boy 12 wearing jeans and white top Mamelodi East near mall", "expected": "R002"},
    {"new": "Zintle Mabaso girl 6 years yellow clothing small mark on cheek Katlehong area", "expected": "R003"},
    {"new": "Sipho Khumalo teenage boy 14 grey and orange tracksuit Dobsonville Soweto Extension 3", "expected": "R004"},
    {"new": "Amahle Zulu girl 9 braided hair pink shirt black pants Umgeni Road Durban North", "expected": "R005"},
    {"new": "Kagiso Sithole boy 11 noticeable gap tooth school uniform Tembisa Hospital area", "expected": "R006"},
    {"new": "Nomvula Dube girl 7 wearing school dress blue and white small scar above right eyebrow Alexandra", "expected": "R007"},
    {"new": "Rethabile Mokoena teenage girl 13 black hoodie red shoes natural hair Mangaung Bloemfontein", "expected": "R008"},
    {"new": "Tshepo Molefe boy 10 wearing glasses maroon school jersey carrying blue bag Pretoria West", "expected": "R009"},
    {"new": "Ayanda Ntuli very young girl 5 pink spotted dress small birthmark on neck Edendale Pietermaritzburg", "expected": "R010"},
]

non_duplicate_tests = [
    "Thandeka Moyo female 7 green uniform short hair Soweto Meadowlands near church",
    "Lungelo Dube male 9 blue shorts yellow shirt Durban Pinetown area",
    "Palesa Sithole female 11 red beret dark jeans Pretoria Atteridgeville",
    "Mpho Khumalo male 6 khaki trousers barefoot Limpopo Tzaneen",
    "Zanele Mokoena female 14 tall braids Johannesburg Soweto Protea Glen",
    "Sibusiso Nkosi male 8 school uniform grey white East London Mdantsane",
    "Nokwanda Cele female 10 blue dress white shoes Durban Umlazi Q Section",
    "Thulani Dlamini male 7 red t-shirt shorts Port Elizabeth New Brighton",
    "Bongiwe Mabaso female 12 braided hair green dress Nelspruit Kanyamazane",
    "Keamogetswe Molefe male 15 tall teenager Mahikeng Montshiwa Township",
]

def check_duplicate(new_text, existing):
    all_texts = [new_text] + [r["text"] for r in existing]
    vectorizer = TfidfVectorizer(analyzer="word", ngram_range=(1, 2), min_df=1)
    tfidf = vectorizer.fit_transform(all_texts)
    scores = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()
    best_idx = int(np.argmax(scores))
    best_score = float(scores[best_idx])
    matched_id = existing[best_idx]["id"]
    return best_score, matched_id

def run_evaluation():
    print("=" * 70)
    print("AI DUPLICATE DETECTION - EVALUATION REPORT")
    print("ISJ107V - Integrated Software Project 2026")
    print(f"Method: TF-IDF Cosine Similarity | Threshold: {THRESHOLD}")
    print(f"Dataset: 20 pairs (10 duplicates + 10 non-duplicates)")
    print("=" * 70)

    tp = fp = tn = fn = 0

    print("\n--- DUPLICATE TESTS (expected: FLAGGED) ---")
    for i, test in enumerate(duplicate_tests, 1):
        score, matched = check_duplicate(test["new"], existing_reports)
        flagged = score >= THRESHOLD
        correct = flagged and matched == test["expected"]
        if correct: tp += 1
        else: fn += 1
        status = "PASS" if correct else "FAIL"
        print(f"  D{i:02d}: score={score:.3f} matched={matched} expected={test['expected']} | {'FLAGGED' if flagged else 'MISSED'} | {status}")

    print("\n--- NON-DUPLICATE TESTS (expected: NOT FLAGGED) ---")
    for i, new in enumerate(non_duplicate_tests, 1):
        score, matched = check_duplicate(new, existing_reports)
        flagged = score >= THRESHOLD
        correct = not flagged
        if correct: tn += 1
        else: fp += 1
        status = "PASS" if correct else "FALSE POSITIVE"
        print(f"  N{i:02d}: score={score:.3f} matched={matched} | {'FLAGGED' if flagged else 'NOT FLAGGED'} | {status}")

    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    accuracy = (tp + tn) / 20

    print("\n" + "=" * 70)
    print("RESULTS SUMMARY")
    print("=" * 70)
    print(f"  True Positives  (duplicates correctly flagged):   {tp}/10")
    print(f"  False Negatives (duplicates missed):              {fn}/10")
    print(f"  True Negatives  (non-duplicates correctly clear): {tn}/10")
    print(f"  False Positives (non-duplicates wrongly flagged): {fp}/10")
    print(f"\n  Precision: {precision:.1%}  (target >= 80%)")
    print(f"  Recall:    {recall:.1%}  (target >= 75%)")
    print(f"  F1 Score:  {f1:.1%}")
    print(f"  Accuracy:  {accuracy:.1%}")
    print("=" * 70)
    passed = precision >= 0.80 and recall >= 0.75
    print(f"\n  OVERALL: {'PASS - meets accuracy requirements' if passed else 'FAIL - does not meet requirements'}")
    print("=" * 70)

if __name__ == "__main__":
    run_evaluation()
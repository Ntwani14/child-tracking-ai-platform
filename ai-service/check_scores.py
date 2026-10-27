from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

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

dup_tests = [
    "Lebo Dlamini girl 8 years dark complexion wearing red dress last seen Soshanguve Block H",
    "Thabo Nkosi boy 12 wearing jeans and white top Mamelodi East near mall",
    "Zintle Mabaso girl 6 years yellow clothing small mark on cheek Katlehong area",
    "Sipho Khumalo teenage boy 14 grey and orange tracksuit Dobsonville Soweto Extension 3",
    "Amahle Zulu girl 9 braided hair pink shirt black pants Umgeni Road Durban North",
    "Kagiso Sithole boy 11 noticeable gap tooth school uniform Tembisa Hospital area",
    "Nomvula Dube girl 7 wearing school dress blue and white small scar above right eyebrow Alexandra",
    "Rethabile Mokoena teenage girl 13 black hoodie red shoes natural hair Mangaung Bloemfontein",
    "Tshepo Molefe boy 10 wearing glasses maroon school jersey carrying blue bag Pretoria West",
    "Ayanda Ntuli very young girl 5 pink spotted dress small birthmark on neck Edendale Pietermaritzburg",
]

non_dup_tests = [
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

print("Duplicate pair best scores:")
dup_scores = []
for i, new in enumerate(dup_tests):
    all_texts = [new] + [r["text"] for r in existing_reports]
    vec = TfidfVectorizer(analyzer="word", ngram_range=(1,2))
    tfidf = vec.fit_transform(all_texts)
    scores = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()
    best = float(scores.max())
    dup_scores.append(best)
    print(f"  D{i+1:02d}: {best:.3f}")

print(f"\nDuplicate scores - min:{min(dup_scores):.3f} max:{max(dup_scores):.3f} avg:{sum(dup_scores)/len(dup_scores):.3f}")

print("\nNon-duplicate pair best scores:")
non_scores = []
for i, new in enumerate(non_dup_tests):
    all_texts = [new] + [r["text"] for r in existing_reports]
    vec = TfidfVectorizer(analyzer="word", ngram_range=(1,2))
    tfidf = vec.fit_transform(all_texts)
    scores = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()
    best = float(scores.max())
    non_scores.append(best)
    print(f"  N{i+1:02d}: {best:.3f}")

print(f"\nNon-duplicate scores - min:{min(non_scores):.3f} max:{max(non_scores):.3f} avg:{sum(non_scores)/len(non_scores):.3f}")
print(f"\nSuggested threshold: between {max(non_scores):.3f} and {min(dup_scores):.3f}")

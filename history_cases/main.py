import json
import pandas as pd


def main():
    df = pd.read_csv("./history-cases.csv")

    keys = [
        'title',
        'background',
        'method',
        'goal',
        'challenge',
        'result',
        'reference',
    ]
    data_list = []
    for col in df.columns[2:]:
        values = df[col].tolist()
        values = ['' if pd.isna(value) else value for value in values]
        data_dict = dict(zip(keys, values))
        data_list.append(data_dict)

    pretty_json = json.dumps(data_list, indent=4, ensure_ascii=False)
    with open('./history-cases.json', 'w', encoding='utf-8') as json_file:
        json_file.write(pretty_json)


if __name__ == '__main__':
    main()

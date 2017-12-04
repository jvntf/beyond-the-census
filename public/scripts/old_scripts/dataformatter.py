import csv

# open the CSV
data = csv.reader(open('../data/glottoQueens_original_RPedited.csv', 'rU'))


# get the header names
fields = data.next()
headers = {}
x = 0
for value in fields:
	headers[value] = x
	x = x+1

# get language name and header
# 
with open('../data/langIds','w+') as output_file:
	# for value in headers:
		for row in data:
			if len(row[headers['id']]) == 8:
				output_file.write(row[headers['id']])
				output_file.write("\n")

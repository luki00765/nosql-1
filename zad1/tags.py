#!/usr/bin/python
import psycopg2
import sys
import pprint
 
def main():
	#Define our connection string
	conn_string = "host='localhost' dbname='nosql' user='postgres' password='psql'"
 
	# print the connection string we will use to connect
	print "Connecting to database\n	->%s" % (conn_string)
 
	# get a connection, if a connect cannot be made an exception will be raised here
	conn = psycopg2.connect(conn_string)
 
	# conn.cursor will return a cursor object, you can use this cursor to perform queries
	cursor = conn.cursor()

	cursor.execute("SELECT Title FROM TRAIN LIMIT 1")

	records = cursor.fetchone()

	pprint.pprint(records)
 
if __name__ == "__main__":
	main()
#!/usr/bin/perl
use strict;
use warnings;

my $RECORDS = 50;
#my $RECORDS = 2000000;
my $MAX_RANGE = 10000;

my $filename = 'liczby.csv';

open(my $fh, '>', $filename) or die "Could not open file '$filename' $!";

print $fh "v\n";

my $value = 0;
for( my $i = 0 ; $i < $RECORDS ; $i++ ) {
	$value = int( rand($MAX_RANGE) );
	print $fh $value."\n";
}

close $fh;

print "Generated!\n";
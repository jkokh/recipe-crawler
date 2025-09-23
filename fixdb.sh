(
  echo "SET autocommit=0; SET unique_checks=0; SET foreign_key_checks=0;";
  cat db-crawler.sql;
  echo "SET foreign_key_checks=1; SET unique_checks=1; COMMIT;";
) | /usr/local/opt/mysql-client@8.4/bin/mysql \
     --protocol=TCP -h 127.0.0.1 -P 3310 -u root -p'rootpassword' recipe_crawler

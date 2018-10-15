for i in $(ls / | grep 'tmp\|share\|srv\|opt\|bin\|sbin\|dev\|home\|root\|sys') ; do
  #  'proc'
  echo "Compressing $i";
  tar -c "/$i" >> "/tmp/$i.tar";
  echo "Sending $i.tar to host"
  cat "/tmp/$i.tar" | nc 192.168.1.56 8888;
  sleep 2; # why?
  echo "Removing $i.tar"
  rm "/tmp/$i.tar";
done
for i in $(ls / | grep 'tmp\|share\|srv\|opt\|bin\|sbin\|dev\|home\|root\|sys') ; do
  #  'proc'
  echo "Compressing $i";
  tar -c "/$i" >> "/tmp/$i.tar";
  echo "Sending $i.tar to host"
  cat "/tmp/$i.tar" | nc 192.168.1.56 8888;
  echo "Removing $i.tar"
  rm "/tmp/$i.tar";
done

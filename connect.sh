# while true; do
#     nc -v 192.168.1.1 23 && sleep 3 (
#     sleep 1; 
#     echo "admin\n"; 
#     sleep 1; 
#     echo "mypentest98"; 
#     sleep 1; 
#     echo "Hello";)
# done

(sleep 1; echo "admin\n"; sleep 1; echo "mypentest98"; sleep 1; echo "Hello"; ) | nc -v 192.168.1.1 23
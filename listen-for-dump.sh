mkdir ./dump
while true; do
    nc -l 8888 >> ./dump/archive.tar
    echo "Decompressing archive.tar"
    tar -xf ./dump/archive.tar -C ./dump
    rm ./dump/archive.tar
done

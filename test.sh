echo "testing private host \n"
curl http://localhost:3000/431387eb7262e1cfc79b125eb8a67c60/192.168.50.92:8080/static/4ae2699e/images/24x24/user.png
 
echo "testing public host \n"
curl http://localhost:3000/431387eb7262e1cfc79b125eb8a67c60/116.85.9.106:3389/csdn/1.mp3

echo "testing domain url \n"
curl http://localhost:3000/431387eb7262e1cfc79b125eb8a67c60/blog.csdn.net/hjue
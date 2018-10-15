# DIR 615

## Vulns

### Reflected XSS

URL: http://192.168.1.1/check_browser?origin=javascript:alert(location)
URL: http://192.168.1.1/browser_check/build/rus/old.html?origin=javascript:alert(location)
Requires a click on "continue" button, unsafe relocation.
File: /srv/anweb/browser_check/build/eng/bad.html

## Paths

### /srv/anweb/browser_check

Found reflected XSS, nothing more.

### /srv/anweb/general

Common imgs, css, js.
No interesting html files.

### /srv/anweb/apps/error404

No querystring args. no postMessage, no hashchange
Page unloads after 10 sec.

### /srv/anweb/apps/trouble



#### URLs

```
function update_gwif_connection(data, version) {
      return $http({
        url: '/dcc_update_gwif_connection',
        method: 'POST',
        data: { data: data, version: version },
      });
    }
```

#### http://192.168.1.1/cookies

Sets cookies in response.

``` md
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: user_ip=0.0.0.0
Set-Cookie: device_mode=router
```


#### **/concat

> Check files with dot and command injection
Returns file based on css_list and js_list files from the local system. 

/error404/css/concat
/general/css/concat?type=css
/concat?type=js&path=error404/js_list
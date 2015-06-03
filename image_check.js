#!/usr/bin/env node
// Get image sizes for images on a given url
var colors                  = require('colors/safe'),
    async                   = require('async'),
    NodeImageSizeScanner    = require('./index'),
    Filesize                = require('filesize'),
    sprintf                 = require("sprintf-js").sprintf,
    argv                    = require('minimist')(process.argv.slice(2));

var usage = "Usage: image_check -u URL [-b MIN_BYTES_TO_ALERT_ON] [-j|-json]\n" +
            "Ex: " + colors.grey("image_check -u http://www.google.com -b 1k");

if (!argv.u) {
    console.log(usage);
    process.exit(1);
}

var url = argv.u,
    byte_threshold = argv.b || 0,
    json_output = argv.j || argv.json || false,
    formatted_output_arr = {},
    json = {
        url             : url,
        byte_threshold  : byte_threshold,
        images          : []
    };

if (typeof(byte_threshold) === "string" && byte_threshold.match(/k/i)){
    byte_threshold = byte_threshold.replace(/k/i, "");
    byte_threshold = +byte_threshold * 1000;
}

if (isNaN(byte_threshold)){
    console.log("Invalid number of bytes: " + byte_threshold + "\n");
    console.log(usage);
    process.exit(1);
}

if (!url.match(/http/i) && !url.match(/https/i)) {
    url = "http://" + url;
}

var options = {
    url             : url,
    byte_threshold  : byte_threshold,
    log_level       : "debug"
};

var scanner = new NodeImageSizeScanner(options);

function main() {
    console.log("in main", url, byte_threshold);

    // scanner.checktest(function(err, json){
    scanner.check({}, function(err, json){
        console.log("start", url, byte_threshold);

        if (err) {
            console.error(err);
            process.exit(1);
        }

        if (!json) {
            console.error("No response");
            process.exit(1);
        }

        if (json_output) {
            console.log(json);
        } else {
            if (byte_threshold) {
                console.log(colors.bold("Image files >" + Filesize(byte_threshold) + " (" + byte_threshold + " bytes)"));
            }

            if (json.images.length > 0) {
                json.images.forEach(function(image_data){
                    var image_url = image_data.image_url,
                        file_size_bytes = image_data.bytes,
                        file_size = Filesize(file_size_bytes),
                        formatted_file_size = sprintf("%11s", file_size);

                    // Images 3x the max size get highlighted in red
                    var formatted_output = colors.yellow(formatted_file_size);
                    if (file_size_bytes > (3 * byte_threshold)) {
                        formatted_output = colors.red(formatted_file_size);
                    }
                    formatted_output += " " + colors.cyan(image_url);

                    console.log("DONE!!!");
                    console.log(formatted_output);
                });
            } else {
                console.log("No images found at " + url);
            }
        }
    });
}

if (require.main === module)
{
    console.log("main start", url, byte_threshold);

    main();
}
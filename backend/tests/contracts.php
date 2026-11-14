<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/src/bootstrap.php';
$cases=json_decode(file_get_contents($argv[1]),false,32,JSON_THROW_ON_ERROR);$count=0;
foreach($cases as $case){
    $valid=true;
    try{if(!$case->payload instanceof stdClass)throw new ApiError('VALIDATION_FAILED','object required',422);validateLead($case->payload);}
    catch(ApiError){$valid=false;}
    if($valid!==$case->valid){fwrite(STDERR,'PHP contract mismatch: ' . $case->name . "\n");exit(1);}
    $count++;
}
echo "PHP lead contract: $count cases passed\n";

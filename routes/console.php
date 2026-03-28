<?php

use App\Jobs\SetInvoicesOverdue;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new SetInvoicesOverdue)->dailyAt('00:10');
